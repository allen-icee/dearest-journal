import { JournalCover } from './components/JournalCover';
import { JournalPage } from './components/JournalPage';
import { GeometryValidation } from './components/GeometryValidation';

function App() {
  const sampleContent = [
    "Today was a beautiful day.",
    "I thought about everything that happened.",
    "I love you."
  ];

  return (
    <div className="screen-preview-container">
      <GeometryValidation />
      
      {/* Cover Page */}
      <JournalCover />

      {/* Content Page */}
      <JournalPage 
        date="09-14-2026" 
        content={sampleContent} 
      />
    </div>
  );
}

export default App;
