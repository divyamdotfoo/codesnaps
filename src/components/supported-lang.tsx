export function Supported() {
  const langs = [
    "go",
    "rust",
    "javascript",
    "python",
    "java",
    "c++",
    "c",
    "typescript",
    "clojure",
    "haskell",
    "csharp",
    "ruby",
  ] as const;

  return (
    <>
      <div className=" flex flex-wrap gap-4 py-12 w-full">
        {langs.map((l) => (
          <p
            key={l}
            className=" font-medium opacity-30 hidden  flex-shrink-0 min-w-48 md:flex items-center justify-center py-4"
            style={{
              transform: `translateX(${35 - Math.random() * 70}px) translateY(${
                30 - Math.random() * 60
              }px)`,
            }}
          >
            {l.toUpperCase()}
          </p>
        ))}
      </div>
      <div className=" md:hidden flex flex-wrap gap-4 pb-4 w-full items-center justify-center">
        {langs.map((l, i) => (
          <p key={`key-${l}`} className=" py-2 px-2 font-semibold opacity-30">
            {l}
          </p>
        ))}
      </div>
    </>
  );
}
