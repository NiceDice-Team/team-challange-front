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
    <path
      d="M4.36646 6.1L10.0165 0.45C10.1498 0.316667 10.3054 0.25 10.4831 0.25C10.6609 0.25 10.8165 0.316667 10.9498 0.45C11.0831 0.583333 11.1498 0.741778 11.1498 0.925333C11.1498 1.10889 11.0831 1.26711 10.9498 1.4L4.83313 7.53333C4.69979 7.66667 4.54424 7.73333 4.36646 7.73333C4.18868 7.73333 4.03313 7.66667 3.8998 7.53333L1.03313 4.66667C0.899795 4.53333 0.835795 4.37511 0.841128 4.192C0.846461 4.00889 0.916017 3.85044 1.04979 3.71667C1.18357 3.58289 1.34202 3.51622 1.52513 3.51667C1.70824 3.51711 1.86646 3.58378 1.99979 3.71667L4.36646 6.1Z"
      fill="#494791"
    />
  </svg>
);

export const HeartFilledIcon = ({ className = "w-4 h-4" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#494791"
    stroke="#494791"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const HeartEmptyIcon = ({ className = "w-4 h-4" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#494791" strokeWidth="1.5" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

export const CloseIcon = ({ className = "w-4 h-4", strokeWidth = 2 }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M6 18L18 6M6 6l12 12" />
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
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const ChevronDownIcon = ({ className = "w-6 h-6", isExpanded = false }) => (
  <svg
    className={`${className} transform transition-transform ${isExpanded ? "rotate-0" : "rotate-180"}`}
    fill="none"
    stroke="#494791"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const GooglePayIcon = ({ className = "" }) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M14.1045 6.0625H7.27148V8.86436L11.2067 8.86523C11.0471 9.79747 10.5335 10.5922 9.74642 11.122V11.1225C9.74668 11.1223 9.74702 11.1222 9.74728 11.122L9.67643 12.7966L12.0898 12.939C12.0894 12.9392 12.0891 12.9396 12.0888 12.9398C13.4566 11.6739 14.2404 9.80259 14.2404 7.5917C14.2403 7.06014 14.1927 6.55156 14.1045 6.0625Z"
        fill="#0085F7"
      />
      <path
        d="M9.74727 11.1234C9.74701 11.1235 9.74666 11.1237 9.7464 11.1239C9.09447 11.5633 8.25504 11.8204 7.2732 11.8204C5.37561 11.8204 3.76587 10.5418 3.18939 8.81821H3.18913C3.18922 8.81847 3.18931 8.81882 3.18939 8.81908L1.17464 8.5L0.773438 10.6935C1.97071 13.0688 4.43098 14.6987 7.27329 14.6987C9.2374 14.6987 10.8876 14.0529 12.0889 12.9411C12.0892 12.9409 12.0896 12.9406 12.0899 12.9403L9.74727 11.1234Z"
        fill="#00A94B"
      />
      <path
        d="M2.96225 7.43036C2.96225 6.94641 3.04291 6.47859 3.18982 6.03879L2.5607 4.16406H0.773432C0.278481 5.14644 0 6.25527 0 7.43036C0 8.60544 0.279348 9.71427 0.773432 10.6966L0.773779 10.6964L3.18982 8.82192C3.18974 8.82166 3.18965 8.8214 3.18956 8.82105C3.04282 8.3816 2.96225 7.91404 2.96225 7.43036Z"
        fill="#FFBB00"
      />
      <path
        d="M7.27363 0.15625C4.43193 0.15625 1.97062 1.7864 0.773438 4.16208L3.18974 6.03681C3.76622 4.31325 5.37596 3.03461 7.27355 3.03461C8.34584 3.03461 9.30617 3.40398 10.0643 4.12565L12.1402 2.05145C10.8795 0.877053 9.23575 0.15625 7.27363 0.15625Z"
        fill="#FF4031"
      />
    </svg>
  );
};

export const ApplePayIcon = ({ className = "" }) => {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.28331 2.27943C8.79815 1.68053 9.14748 0.876457 9.05528 0.0546875C8.30164 0.0895379 7.38202 0.517137 6.84957 1.11648C6.37149 1.62973 5.94839 2.46756 6.05869 3.2548C6.90477 3.32297 7.74992 2.86151 8.28331 2.27943Z"
        fill="black"
      />
      <path
        d="M9.04611 3.41081C7.81757 3.34275 6.77297 4.05931 6.18636 4.05931C5.5994 4.05931 4.70093 3.44511 3.72917 3.46161C2.46445 3.47887 1.29088 4.14398 0.649064 5.20183C-0.67098 7.31798 0.300671 10.4569 1.58442 12.1804C2.20779 13.0331 2.95908 13.9719 3.94906 13.9382C4.88441 13.9042 5.25101 13.375 6.38793 13.375C7.52403 13.375 7.85421 13.9382 8.84442 13.9212C9.87116 13.9042 10.5131 13.0681 11.1365 12.2146C11.8516 11.2426 12.1444 10.3041 12.1629 10.2526C12.1444 10.2356 10.1829 9.53574 10.1648 7.43717C10.1463 5.68002 11.7048 4.84426 11.7782 4.79237C10.898 3.58156 9.52289 3.445 9.04611 3.41081Z"
        fill="black"
      />
    </svg>
  );
};

export const CreditCardIcon = ({ className = "" }) => {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <path
        d="M1 9C1 5.229 1 3.343 2.172 2.172C3.344 1.001 5.229 1 9 1H13C16.771 1 18.657 1 19.828 2.172C20.999 3.344 21 5.229 21 9C21 12.771 21 14.657 19.828 15.828C18.656 16.999 16.771 17 13 17H9C5.229 17 3.343 17 2.172 15.828C1.001 14.656 1 12.771 1 9Z"
        stroke="black"
        strokeWidth="1.5"
      />
      <path d="M9 13H5M13 13H11.5M1 7H21" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const LoadingSpinner = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
        transform="rotate(-90 25 25)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
