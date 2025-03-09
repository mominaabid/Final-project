// app/page.tsx
import HomeClient from './components/landing'; // Adjust path as needed

export default function Page() {
  return (
    <div>
      <HomeClient />
    </div>
  );
}

export const metadata = {
  title: "Honest Travel",
  description: "Plan your tour with Honest Travel",
};