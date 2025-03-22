# Final-project
# AI Travel Genie

## Overview
AI Travel Genie is an AI-powered travel planning web application that generates customized travel itineraries based on user inputs. Users provide basic travel details, answer dynamic survey questions, and receive a personalized travel plan with recommended activities.

## Features
- Users input their city name, travel dates, and number of travelers.
- AI generates a brief description of the city and suggested activities.
- Users select activities they are interested in.
- The system generates 7 dynamic survey questions to refine recommendations.
- A complete travel plan is generated based on user selections and survey responses.
- Travel plans are stored in a MySQL database for future retrieval.

## Tech Stack
### Frontend
- **Framework:** Next.js (app directory structure)
- **Languages:** TypeScript, JavaScript, HTML, CSS
- **UI Components:** Bootstrap (for styling)
- **Animations:** Implemented for an enhanced user experience

### Backend
- **Framework:** Flask (Python)
- **Database:** MySQL (via XAMPP)
- **AI Processing:** OpenAI

## Workflow
1. **User Input:** Users enter city name, travel date, and number of travelers.
2. **AI Processing:** The backend generates a city description and recommended activities.
3. **Activity Selection:** Users select activities from checkboxes.
4. **Survey Questions:** AI dynamically generates 7 personalized survey questions.
5. **Final Travel Plan:** The system refines the plan based on responses and generates a complete itinerary.
6. **Data Storage:** The travel plan is stored in a MySQL database 

## Database Schema (MySQL)
| Column Name         | Data Type  | Description |
|--------------------|-----------|-------------|
| id                | INT (PK)  | Unique ID for each entry |
| city              | VARCHAR   | Travel destination |
| start_date        | DATE      | Trip start date |
| end_date          | DATE      | Trip end date |
| city_description  | TEXT      | AI-generated city overview |
| suggested_activities | TEXT    | AI-generated activity suggestions |
| selected_activities | TEXT    | User-selected activities |
| travel_plan       | TEXT      | Final travel itinerary |

## API Endpoints
### `/api/submit-survey`
- **Method:** POST
- **Description:** Receives user input (city name, date, number of travelers) and returns city details + activity suggestions.

### `/api/get-travel-plan`
- **Method:** POST
- **Description:** Accepts user-selected activities and survey responses, generates, and returns a travel plan.

## Setup Instructions
### Prerequisites
- Install **XAMPP** for MySQL database.
- Set up a **Python virtual environment** in PyCharm.
- Install required dependencies using:
  ```sh
  pip install flask mysql-connector-python openai langchain
  ```
- Start the MySQL server and create the required table using the provided schema.

### Running the Project
1. **Start the MySQL Database:** Ensure XAMPP MySQL service is running.
2. **Run the Flask Backend:**
   ```sh
   python app.py
   ```
3. **Start the Next.js Frontend:**
   ```sh
   npm run dev
   ```

## Future Enhancements
- User authentication for saving travel plans.
- Multi-user collaboration on itinerary planning.
- Integration of real-time flight and hotel booking APIs.

## Contributors
- **Frontend Development:** Hamna
- **API Handling:** Alishba
- **Backend & AI Processing:** Momina

## License
This project is open-source under the MIT License.

