import { useState } from "react";

const CookieManager = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    console.log("🚀 ~ file: cookieManager.tsx:8 ~ handleOpen ~ open:", open);
  };

  return (
    <>
      <button onClick={handleOpen}>Gestion des cookies</button>
      <div
        className={` fixed ${
          open ? "block" : "hidden"
        } left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-neutral-800/80`}
      >
        <div className="bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-50 flex flex-col items-end px-5 py-2 rounded-sm text-lg">
          {/* close button */}
          <button onClick={handleOpen}>X</button>
          <h1>Cookie Manager</h1>
        </div>
      </div>
    </>
  );
};

export default CookieManager;
