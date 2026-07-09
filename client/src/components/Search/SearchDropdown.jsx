import { useSearchStore } from "../../store/searchStore";
import SearchSection from "./SearchSection";
import { LoaderCircle, Search, Inbox } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const SearchDropdown = () => {
  const { theme } = useTheme();
  const {
    results,
    loading,
  } = useSearchStore();

  if (loading) {
    return (
      <div
        className={`
          absolute
          mt-2
          w-full
          rounded-xl
          border
          ${theme.border}
          ${theme.card.primary}
          p-4 sm:p-6
          z-50
          shadow-2xl
          shadow-black/50
          flex
          flex-col
          items-center
          justify-center
          gap-3
          min-h-[100px] sm:min-h-[120px]
        `}
      >
        <LoaderCircle className={`animate-spin ${theme.text.info}`} size={24} />
        <p className={`${theme.text.muted} text-sm sm:text-base`}>Searching...</p>
      </div>
    );
  }

  const total =
    results.projects?.length +
    results.tasks?.length +
    results.members?.length +
    results.activities?.length || 0;

  return (
    <div
      className={`
        absolute
        mt-1 sm:mt-2
        w-full
        max-h-[300px] sm:max-h-[400px] md:max-h-[500px]
        overflow-y-auto
        rounded-xl
        border
        ${theme.border}
        ${theme.card.modal || theme.card.primary}
        z-50
        shadow-2xl
        shadow-black/50
        scrollbar-thin
        scrollbar-thumb-neutral-700
        scrollbar-track-transparent
        left-0
        right-0
        mx-auto
        ${window.innerWidth < 640 ? 'w-[calc(100vw-2rem)] left-1/2 -translate-x-1/2' : ''}
      `}
    >
      {total === 0 ? (
        <div className={`
          flex 
          flex-col 
          items-center 
          justify-center 
          p-6 sm:p-8 
          gap-2 sm:gap-3 
          min-h-[120px] sm:min-h-[150px]
        `}>
          <div className={`
            p-2 sm:p-3 
            rounded-full 
            bg-neutral-800/50
          `}>
            <Inbox size={20} className={theme.text.muted} />
          </div>
          <p className={`${theme.text.primary} font-medium text-sm sm:text-base`}>
            No Results Found
          </p>
          <p className={`${theme.text.muted} text-xs sm:text-sm`}>
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <>
          {results.projects?.length > 0 && (
            <SearchSection
              title="Projects"
              items={results.projects}
              type="project"
            />
          )}

          {results.tasks?.length > 0 && (
            <SearchSection
              title="Tasks"
              items={results.tasks}
              type="task"
            />
          )}

          {results.members?.length > 0 && (
            <SearchSection
              title="Members"
              items={results.members}
              type="member"
            />
          )}

          {results.activities?.length > 0 && (
            <SearchSection
              title="Activities"
              items={results.activities}
              type="activity"
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchDropdown;