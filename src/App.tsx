import { JournalCover } from './components/JournalCover';
import { JournalBackCover } from './components/JournalBackCover';
import { JournalPage } from './components/JournalPage';
import { generateMonthPages } from './utils/calendar';

function App() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentYear = today.getFullYear();
  
  const sampleContent = [
    "Today was a beautiful day.",
    "I thought about everything that happened.",
    "I love you."
  ];

  // Generate the full 32-page interior document model
  const interiorPages = generateMonthPages(currentMonth, currentYear, sampleContent);

  return (
    <div className="screen-preview-container">
      {/* 1. Front Cover */}
      <JournalCover month={currentMonth} year={currentYear} />

      {/* 2. Interior Pages (Up to 32 slots) */}
      {interiorPages.map((pageData) => (
        <JournalPage 
          key={`page-${pageData.pageNumber}`}
          date={pageData.date} 
          content={pageData.content} 
        />
      ))}

      {/* 3. Back Cover */}
      <JournalBackCover />
    </div>
  );
}

export default App;
