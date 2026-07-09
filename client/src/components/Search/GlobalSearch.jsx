import { Search, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchStore } from "../../store/searchStore";
import { useTheme } from "../../context/ThemeProvider";
import SearchDropdown from "./SearchDropdown";

const GlobalSearch = () => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inputRef = useRef(null);

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { search, loading, clearSearch } = useSearchStore();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        search(value);
        setOpen(true);
      } else {
        clearSearch();
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, search, clearSearch]);

  // Close on outside click
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = useCallback(() => {
    setValue("");
    clearSearch();
    setOpen(false);
    inputRef.current?.focus();
  }, [clearSearch]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (value.trim()) {
      setOpen(true);
    }
  }, [value]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!newValue.trim()) {
      clearSearch();
      setOpen(false);
    }
  }, [clearSearch]);

  const showDropdown = open && (value.trim() || loading);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative group">
        <Search
          className={`
            absolute left-3 top-1/2 -translate-y-1/2 
            transition-colors duration-200
            ${isFocused || value ? theme.text.info : theme.text.muted}
          `}
          size={18}
        />

        <input
          ref={inputRef}
          value={value}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          placeholder="Search anything... (⌘K)"
          className={`
            w-full
            rounded-xl
            border
            px-10
            py-2.5
            outline-none
            transition-all
            duration-200
            ${theme.input.primary}
            ${theme.text.primary}
            placeholder:${theme.text.muted}
            ${isFocused || value 
              ? `${theme.border} ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10` 
              : theme.border
            }
          `}
          aria-label="Global search"
          role="searchbox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />

        {loading && (
          <LoaderCircle
            size={18}
            className={`
              absolute
              right-10
              top-1/2
              -translate-y-1/2
              animate-spin
              ${theme.text.info}
            `}
          />
        )}

        {value && !loading && (
          <button
            onClick={handleClear}
            className={`
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              p-0.5
              rounded-full
              ${theme.text.muted}
              hover:${theme.text.primary}
              hover:${theme.card.secondary}
              transition-all
              duration-200
            `}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {!value && !isFocused && (
          <div className={`
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            flex
            items-center
            gap-1
            text-xs
            ${theme.text.muted}
            pointer-events-none
          `}>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute w-full mt-2 left-0 top-full z-50">
          <SearchDropdown />
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;