# REACT-PROYECTO

# 1. ANALISIS DE REPOSITORIO <br>
 [repositorio github](https://github.com/ethan-fullstack/my-reactive-farm)<br>
-  Estructura del repositorio
```bash
src/
├── components/
│   ├── Alert.jsx
│   ├── AnimalCard.jsx
│   ├── AnimalList.jsx
│   ├── DarkModeToogle.jsx
│   ├── Layout.jsx
│   └── Loader.jsx
├── hooks/
│   └── useFetchAnimals.js
├── pages/
│   └── Farm.jsx
├── services/
│   └── animalsApi.js
├── App.jsx
└── main.jsx
```
 - Uso de `UseState` y `UseEffect` en el proyecto se hace uso de estos hooks para la conexion con la api de mokaPI y el useState para el filtro de busqueda tambien nos ayuda a validar ciertos campos y volver a renderizarlos

```bash
import { useState } from "react";
import Alert from "./Alert.jsx";

const TYPES = ["cow", "chicken", "sheep", "pig", "other"];
const STATUSES = ["healthy", "review", "sick"];

export default function AnimalForm({
  onSubmit,
  onSuccess,
  submitError,
  initialValues = {
    name: "",
    type: "",
    age: "",
    weight: "",
    status: "",
  },
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
```
- El implemento `TailwindCss` es muy importante ya que nos perimite una personalizacion profunda a cada componente utilizando las utilidades de clase que contiene `TailwindCss`

 ```bash
<article
      role="article"
      tabIndex="0"
      className={`flex flex-col gap-2 rounded-xl border p-4 shadow-sm transition hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${statusColors[status]}`}
      onClick={() => onSelect?.(animal)}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
            status === "healthy"
              ? "bg-green-600 text-white"
              : status === "review"
              ? "bg-yellow-500 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status}
        </span>
      </header>

      <ul className="text-sm space-y-1">
        <li>
          <strong className="text-gray-600 dark:text-gray-300">Type:</strong>{" "}
          {type}
        </li>
        <li>
          <strong className="text-gray-600 dark:text-gray-300">Age:</strong>{" "}
          {age} years
        </li>
        <li>
          <strong className="text-gray-600 dark:text-gray-300">Weight:</strong>{" "}
          {weight} kg
        </li>
      </ul>
    </article>
  ```

# 2. Cuestionario de React

## - ¿Cuál es la diferencia entre un componente presentacional y un componente de página en React?<br><br>
-la diferencia entre estos esque un compnente presentacional se enfoca en la parte visual y no depende de una api, mientras que un componente de pagina se enfoco en como funciona algo. (EJ)

```bash
aqui vemos un componente presentacional que es el cambio de tema (claro, oscuro) este solo se enfoca en lo visual de la pagina

export default function DarkModeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* no-op */
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className={`fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm 
                  backdrop-blur supports-[backdrop-filter]:bg-white/70 border-gray-300 text-gray-800 
                  hover:bg-white shadow-sm
                  dark:supports-[backdrop-filter]:bg-neutral-800/60 dark:border-neutral-700 dark:text-gray-100 
                  dark:hover:bg-neutral-800 ${className}`}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

  ```



```bash
// este es un componente de pagina por su uso de hooks y dependencia de Api

import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import AnimalList from "../components/AnimalList.jsx";
import AnimalForm from "../components/AnimalForm.jsx";
import { getAnimals, createAnimal } from "../services/animalsApi.js";

// Filtros disponibles
const TYPES = ["all", "cow", "chicken", "sheep", "pig", "other"];
const STATUSES = ["all", "healthy", "review", "sick"];

export default function Farm() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Filtros UI
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Error de envío desde el formulario (red / servidor)
  const [submitError, setSubmitError] = useState(null);

  // Carga inicial con useEffect
  useEffect(() => {
    let cancelled = false;
    async function fetchAnimals() {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await getAnimals();
        if (!cancelled) setAnimals(data);
      } catch (err) {
        if (!cancelled) setLoadError("Failed to load animals. Please retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAnimals();
    return () => {
      cancelled = true;
    };
  }, []);

  // Crear animal (llamado por AnimalForm)
  async function handleCreate(animal) {
    try {
      setSubmitError(null);
      const created = await createAnimal(animal);
      // Optimistic update (prepend)
      setAnimals((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setSubmitError("Could not create the animal. Try again.");
      throw err; // mantiene el flujo del formulario
    }
  }

  // Derivar lista filtrada + búsqueda
  const filteredAnimals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return animals.filter((a) => {
      const byType = typeFilter === "all" || a.type === typeFilter;
      const byStatus = statusFilter === "all" || a.status === statusFilter;
      const byQuery =
        q.length === 0 ||
        a.name?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q) ||
        String(a.weight).includes(q) ||
        String(a.age).includes(q);
      return byType && byStatus && byQuery;
    });
  }, [animals, typeFilter, statusFilter, query]);

  return (
    <Layout title="My Reactive Farm 🐄🌾">
      {/* Loading / Error de carga */}
      {loading && <Loader message="Fetching animals from the farm…" />}
      {loadError && <Alert variant="error">{loadError}</Alert>}

      {/* Contenido principal */}
      {!loading && !loadError && (
        <div className="space-y-8">
          {/* Formulario controlado para crear animales */}
          <section aria-labelledby="create-animal">
            <h2 id="create-animal" className="mb-3 text-xl font-semibold">
              Add new animal
            </h2>
            <AnimalForm onSubmit={handleCreate} submitError={submitError} />
          </section>

          {/* Filtros y lista */}
          <section aria-labelledby="animals-list">
            <h2 id="animals-list" className="sr-only">
              Animals
            </h2>

            <AnimalList animals={filteredAnimals}>
              {/* Controls (composición) */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, type, age, weight…"
                  className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                />

                {/* Type filter */}
                <label className="sr-only" htmlFor="type-filter">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {/* Status filter */}
                <label className="sr-only" htmlFor="status-filter">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </AnimalList>
          </section>
        </div>
      )}
    </Layout>
  );
}
```
## - ¿Para qué se utiliza `useState` en el proyecto?<br><br>
-useState se utiliza para gestionar el estado interno del componente `Farm.jsx`, es decir, cualquier dato que pueda cambiar con el tiempo y que deba provocar una actualización de la interfaz.
```bash
const [animals, setAnimals] = useState([]);
```
Función: Almacena la lista principal de animales obtenida de MockAPI. Es el array central de datos de la aplicación. Se actualiza cuando se cargan los datos y cuando se crea un nuevo animal.
```bash
const [loading, setLoading] = useState(true);
```
Función: Indica el estado de la carga de datos. Es un booleano (true o false). Se establece en true al inicio de la petición a la API y en false cuando la petición finaliza (ya sea con éxito o con error). Controla la visibilidad del componente `<Loader>`.

## - ¿Cómo se usa useEffect para cargar datos desde MockAPI al inicio? 

1. Inicialización: El componente Farm se monta por primera vez.

2. Disparo: `useEffect` se ejecuta inmediatamente después del renderizado inicial porque su array de dependencias es vacío ([]). Esto indica que el efecto solo debe ejecutarse una vez, al inicio del ciclo de vida del componente.

3. Lógica Asíncrona: Se llama a la función `fetchAnimals` asíncrona.

4. Llamada a Servicio: fetchAnimals llama a `const data = await getAnimals();` (función definida en animalsApi.js), que realiza la petición HTTP real.

5. Gestión de Estado:

    -Antes de la llamada: `setLoading(true)` y ``setLoadError(null)` se ejecutan para mostrar el loader y limpiar errores previos.

    -Si tiene éxito: `setAnimals(data)` actualiza el estado con los datos obtenidos.

    -Si falla: setLoadError("Failed to load...") guarda el mensaje de error.

    -Finalmente: setLoading(false) oculta el loader.

6. Función de Limpieza (Cancelación): La función de retorno  `(return () => { cancelled = true; };)` evita que se intente actualizar el estado si la petición finaliza después de que el componente ha sido desmontado.

## - ¿Cómo maneja el proyecto los estados de loading, error y lista vacía? ¿Qué se muestra al usuario en cada caso?
|Estado|variable controlada|vista usuario|
|------|-------------------|-------------|
|loading|`loading`(boolean)|se muestra el componente loader con un mensaje|
|loadError|`loadError`(String)|se muestra el componente Alert cuando falla la Api|
|lista vacia|`Array`([])|muestra un mensaje de que no hay animales creados|
