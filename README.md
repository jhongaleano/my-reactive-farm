
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
aqui vemos un componente presentacional que es un card 


export default function AnimalCard({ animal, onSelect }) {
  const { name, type, age, weight, status } = animal;

  // Estilos condicionales según estado del animal
  const statusColors = {
    healthy:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900/50",
    review:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-200 dark:border-yellow-900/50",
    sick: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/50",
  };

  return (
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

## - ¿Qué significa que un formulario sea controlado en React?
- un formulario controlado por react es cuando el estado de un `Input` es controlado por `UseState` no permitiendo que el DOM tenga el valor de entrada del `Input`<br>
El componente `<AnimalForm>`:

    -Asigna el Valor: Se utiliza el atributo value del elemento input para vincularlo a una variable de estado (ej., `<input value={query} ... />`).

    -Controla el Cambio: Se utiliza el handler onChange para llamar inmediatamente a la función que actualiza ese estado (ej., `onChange={(e) => setQuery(e.target.value)}`).


## - ¿Por qué es buena práctica separar la lógica de datos en archivos como animalsApi.js en vez de hacer peticiones dentro de los componentes?

   -Separación de Responsabilidades: Los componentes de React se centran en la UI y el estado, mientras que el servicio se centra en la red y la persistencia de datos. Esto hace que cada archivo sea más fácil de entender y mantener.

   -Reutilización: Los métodos de API (getAnimals, createAnimal, etc.) pueden ser importados y utilizados por cualquier otro componente (AnimalListPage, DashboardWidget, etc.) sin duplicar la configuración de Axios o la lógica de manejo de errores.

   -Mantenimiento y Pruebas: Si se cambia la URL de la API o la librería HTTP (de Axios a fetch), solo hay que modificar el archivo `animalsApi.js`. Además, es más fácil probar el servicio de forma aislada.

## - ¿Qué hace que AnimalCard sea un componente reutilizable? ¿Cómo se podría usar una tarjeta similar en otro contexto?

- Recibe toda la información que necesita a través de una sola prop (probablemente animal). No tiene llamadas a la API. Su única responsabilidad es mostrar los detalles del animal (name, type, age, etc.) y de los botones de acción.

    -Una página de Favoritos: En lugar de la lista principal, muestra los animales marcados como favoritos.

    -Una Modal de Detalles: Se muestra una tarjeta similar con más información cuando el usuario hace clic en un animal.

    -Una sección de "Animales Similares": En la página de detalle de un animal, se utiliza para mostrar sugerencias basadas en el tipo.

## - ¿Qué elementos del proyecto contribuyen a la accesibilidad?
   -`aria-labelledby` y `id` en Secciones:
```bash
Ejemplo: <section aria-labelledby="create-animal"> junto con <h2 id="create-animal">.
```

   -`sr-only` en Etiquetas (`<label>`) Ocultas:
```bash
Ejemplo: <label className="sr-only" htmlFor="search">Search</label>.
```


   -Atributo `title` en Botones de Icono:
```bash
Ejemplo (presumiblemente en AnimalCard): <button title="Eliminar">🗑️</button>.
```
## - Antes de agregar una funcionalidad nueva, ¿qué pasos debes pensar según la filosofía de React? (ej.: qué datos, qué estado, dónde vive la lógica)

- Identificar la Lógica de Datos: ¿Qué cambio necesita el backend?

-Paso de API: Crear una nueva función en animalsApi.js (ej., updateAnimalFavoriteStatus(id, isFavorite)).

- Identificar el Estado: ¿Qué estado necesito para esta funcionalidad?

-Local: Un estado booleano en el componente AnimalCard para controlar la apariencia del icono (lleno/vacío).

-Global: El array de animals en el Farm debe actualizarse cuando el estado de favorito cambie.

- Identificar la Ubicación de la Lógica: ¿Dónde vive la función que maneja el evento?

-La función principal que llama a la API (handleToggleFavorite) debe vivir en el Componente Contenedor (Farm.jsx) porque es responsable de actualizar el estado global de animals.

- Flujo de Datos (Props): ¿Cómo se comunica el Contenedor con la Vista?

-El Farm pasa la función de manejo del evento (onToggleFavorite) como una prop al AnimalList, y este la pasa al AnimalCard.

-El AnimalCard recibe la función y la llama cuando el usuario hace clic en el botón de "favorito".


## -¿Qué conceptos de React aprendidos en este proyecto podrías reutilizar en otro tipo de aplicación?

   -Componentes Contenedores vs. Presentacionales: Mantener la lógica de estado y API en un componente padre (Farm) y la UI pura en los hijos (AnimalList, Alert, Loader).

   -Ciclo de Vida con useEffect: Utilizar useEffect con un array de dependencias vacío ([]) para ejecutar código de inicialización (como la carga de datos) solo una vez al inicio.

   -Derivación de Estado con useMemo: Utilizar useMemo para calcular un valor costoso (como la lista de filteredAnimals) solo cuando sus dependencias (animals, query, filter) cambian. Esto es crucial para la optimización del rendimiento.

   -Optimistic UI/Actualización de Estado Inmediata: Actualizar la UI inmediatamente antes de que se confirme la respuesta de la API (ej., setAnimals((prev) => [created, ...prev]) al crear un animal). Esto mejora la percepción de velocidad de la aplicación, aunque requiere manejo de rollback en caso de error.
