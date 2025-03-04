from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from gpt_queries import get_city_description, get_city_activities, generate_travel_plan  # Import GPT functions

# Set up logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Temporary storage to hold travel plans (like a session)
temp_storage = {}

# Allow CORS for all routes under /api/*
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Route to get city info (description and activities)
@app.route('/get_city_info', methods=['POST'])
def get_city_info():
    try:
        app.logger.debug('Received request for city info')
        app.logger.debug(f'Request headers: {request.headers}')

        if not request.is_json:
            app.logger.error('Request does not contain JSON data')
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.json
        app.logger.debug(f'Received data: {data}')

        city = data.get('city')
        if not city:
            app.logger.error('No city provided in request')
            return jsonify({'error': 'City name is required'}), 400

        app.logger.debug(f'Processing request for city: {city}')

        # Fetch city description and activities from GPT functions
        description = get_city_description(city)
        activities = get_city_activities(city)

        response_data = {
            'city': city,
            'description': description,
            'activities': activities
        }

        app.logger.debug(f'Sending response: {response_data}')
        return jsonify(response_data)

    except Exception as e:
        app.logger.error(f'Error processing request: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 500


# Route to generate travel plan and store it
@app.route('/generate_travel_plan', methods=['POST'])
def generate_and_store_travel_plan():
    try:
        app.logger.debug('Received request for travel plan generation')
        app.logger.debug(f'Request headers: {request.headers}')

        if not request.is_json:
            app.logger.error('Request does not contain JSON data')
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.json
        app.logger.debug(f'Received data: {data}')

        # Extract required fields
        city = data.get("city")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        num_travelers = data.get("num_travelers")
        selected_activities = data.get("selected_activities", [])

        if not city or not start_date or not end_date or not num_travelers or not selected_activities:
            app.logger.error('Missing required fields')
            return jsonify({"error": "Missing required fields"}), 400

        app.logger.debug(f'Generating travel plan for {city} from {start_date} to {end_date} with {num_travelers} travelers.')

        # Generate travel plan
        travel_plan = generate_travel_plan(city, start_date, end_date, num_travelers, selected_activities)

        if not travel_plan:
            app.logger.error('GPT function did not return a travel plan')
            return jsonify({"error": "Failed to generate travel plan"}), 500

        # Store the travel plan temporarily
        temp_storage["latest_plan"] = {
            "city": city,
            "start_date": start_date,
            "end_date": end_date,
            "num_travelers": num_travelers,
            "selected_activities": selected_activities,
            "travel_plan": travel_plan
        }

        app.logger.debug(f'Travel plan stored successfully')

        return jsonify({"message": "Travel plan generated successfully. Retrieve using /get_travel_plan"}), 200

    except Exception as e:
        app.logger.error(f'Error processing request: {str(e)}', exc_info=True)
        return jsonify({"error": str(e)}), 500


# Route to fetch the stored travel plan
@app.route('/get_travel_plan', methods=['GET'])
def get_stored_travel_plan():
    try:
        app.logger.debug('Received request to fetch stored travel plan')

        if "latest_plan" not in temp_storage:
            app.logger.error('No travel plan found in storage')
            return jsonify({"error": "No travel plan available"}), 404

        travel_plan = temp_storage["latest_plan"]
        app.logger.debug(f'Returning stored travel plan: {travel_plan}')

        return jsonify(travel_plan), 200

    except Exception as e:
        app.logger.error(f'Error retrieving travel plan: {str(e)}', exc_info=True)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)