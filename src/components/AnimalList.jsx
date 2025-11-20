import AnimalCard from "./AnimalCard.jsx";
import Alert from "./Alert.jsx";

export default function AnimalList({ animals = [], onSelect, children }) {
  const isEmpty = !animals || animals.length === 0;

  return (
    <section aria-label="Animals list" className="space-y-4  w-full rounded-3xl px-9 py-9 dark:bg-gray-700">
      {/* Zona de composición para filtros/acciones */}
      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}

      {/* Empty state */}
      {isEmpty ? (
        <Alert variant="info">
          No animals found. Add a new one to get started 🐾
        </Alert>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {animals.map((animal) => (
            <li key={animal.id} role="listitem">
              <AnimalCard animal={animal} onSelect={onSelect}  />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
