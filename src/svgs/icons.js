// SVG icon paths (from public folder)
export const LogoIcon = "/icons/logo.svg";
export const SearchIcon = "/icons/search.svg";
export const ProfileIcon = "/icons/profile.svg";
export const CartIcon = "/icons/cart.svg";
export const StarEmptyIcon = "/icons/star-empty.svg";
export const StarFilledIcon = "/icons/star-filled.svg";
export const StarEmptyIcon16 = "/icons/star-empty-16.svg";
export const StarFilledIcon16 = "/icons/star-filled-16.svg";
export const CircleRedIcon = "/icons/circle-red.svg";
export const CircleOrangeIcon = "/icons/circle-orange.svg";
export const CircleGreenIcon = "/icons/circle-green.svg";
export const CircleGrayIcon = "/icons/circle-gray.svg";
// React components for inline SVGs
export const CheckmarkIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
    <path d="M4.36646 6.1L10.0165 0.45C10.1498 0.316667 10.3054 0.25 10.4831 0.25C10.6609 0.25 10.8165 0.316667 10.9498 0.45C11.0831 0.583333 11.1498 0.741778 11.1498 0.925333C11.1498 1.10889 11.0831 1.26711 10.9498 1.4L4.83313 7.53333C4.69979 7.66667 4.54424 7.73333 4.36646 7.73333C4.18868 7.73333 4.03313 7.66667 3.8998 7.53333L1.03313 4.66667C0.899795 4.53333 0.835795 4.37511 0.841128 4.192C0.846461 4.00889 0.916017 3.85044 1.04979 3.71667C1.18357 3.58289 1.34202 3.51622 1.52513 3.51667C1.70824 3.51711 1.86646 3.58378 1.99979 3.71667L4.36646 6.1Z" fill="#494791"/>
  </svg>
);

export const HeartFilledIcon = ({ className = "w-4 h-4" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#494791" stroke="#494791" strokeWidth="1.5" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const HeartEmptyIcon = ({ className = "w-4 h-4" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#494791" strokeWidth="1.5" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const MinusIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterCheckmarkIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const ChevronDownIcon = ({ className = "w-6 h-6", isExpanded = false }) => (
  <svg
    className={`${className} transform transition-transform ${isExpanded ? 'rotate-0' : 'rotate-180'}`}
    fill="none"
    stroke="#494791"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
