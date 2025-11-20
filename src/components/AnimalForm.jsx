// src/components/AnimalForm.jsx
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

  function validate(v) {
    const e = {};
    if (!v.name || v.name.trim().length < 2) {
      e.name = "Name is required (min 2 characters).";
    }
    if (!v.type || !TYPES.includes(v.type)) {
      e.type = "Please select a valid animal type.";
    }
    const ageNum = Number(v.age);
    if (!v.age || Number.isNaN(ageNum) || ageNum <= 0) {
      e.age = "Age must be a number greater than 0.";
    }
    const weightNum = Number(v.weight);
    if (!v.weight || Number.isNaN(weightNum) || weightNum <= 0) {
      e.weight = "Weight must be a number greater than 0.";
    }
    if (!v.status || !STATUSES.includes(v.status)) {
      e.status = "Please select a valid status.";
    }
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Limpieza del error del campo editado
    if (errors[name]) {
      setErrors((prev) => {
        const clone = { ...prev };
        delete clone[name];
        return clone;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormMessage(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Enfocar el primer error accesible
      const firstKey = Object.keys(nextErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      el?.focus();
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: values.name.trim(),
        type: values.type,
        age: Number(values.age),
        weight: Number(values.weight),
        status: values.status,
      };

      const result = await onSubmit?.(payload);
      setFormMessage("Animal created successfully 🐄");
      // Opcional: limpiar el formulario
      setValues(initialValues);
      onSuccess?.(result ?? payload);
    } catch (err) {
      console.error(err);
      // Errores de red/servidor se muestran vía submitError (prop)
      setFormMessage(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Resumen de errores de red o éxito local */}
      {submitError && <Alert variant="error">{submitError}</Alert>}
      {formMessage && <Alert variant="success">{formMessage}</Alert>}

      {/* Nombre */}
      <div className="grid gap-1.5">
        <label
          htmlFor="field-name"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="field-name"
          name="name"
          type="text"
          required
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "error-name" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 dark:bg-neutral-800 dark:text-gray-100 ${
            errors.name
              ? "border-red-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-green-600 dark:border-neutral-700"
          }`}
          placeholder="Lola"
        />
        {errors.name && (
          <p
            id="error-name"
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Type */}
      <div className="grid gap-1.5">
        <label
          htmlFor="field-type"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Type <span className="text-red-600">*</span>
        </label>
        <select
          id="field-type"
          name="type"
          required
          value={values.type}
          onChange={handleChange}
          aria-invalid={Boolean(errors.type)}
          aria-describedby={errors.type ? "error-type" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-800 dark:text-gray-100 ${
            errors.type
              ? "border-red-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-green-600 dark:border-neutral-700"
          }`}
        >
          <option value="" disabled>
            Select type…
          </option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type && (
          <p
            id="error-type"
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.type}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="grid gap-1.5">
        <label
          htmlFor="field-age"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Age (years) <span className="text-red-600">*</span>
        </label>
        <input
          id="field-age"
          name="age"
          type="number"
          min="1"
          step="1"
          required
          value={values.age}
          onChange={handleChange}
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? "error-age" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-800 dark:text-gray-100 ${
            errors.age
              ? "border-red-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-green-600 dark:border-neutral-700"
          }`}
          placeholder="3"
        />
        {errors.age && (
          <p
            id="error-age"
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.age}
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="grid gap-1.5">
        <label
          htmlFor="field-weight"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Weight (kg) <span className="text-red-600">*</span>
        </label>
        <input
          id="field-weight"
          name="weight"
          type="number"
          min="1"
          step="0.1"
          required
          value={values.weight}
          onChange={handleChange}
          aria-invalid={Boolean(errors.weight)}
          aria-describedby={errors.weight ? "error-weight" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-800 dark:text-gray-100 ${
            errors.weight
              ? "border-red-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-green-600 dark:border-neutral-700"
          }`}
          placeholder="250"
        />
        {errors.weight && (
          <p
            id="error-weight"
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.weight}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="grid gap-1.5">
        <label
          htmlFor="field-status"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Status <span className="text-red-600">*</span>
        </label>
        <select
          id="field-status"
          name="status"
          required
          value={values.status}
          onChange={handleChange}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? "error-status" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-800 dark:text-gray-100 ${
            errors.status
              ? "border-red-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-green-600 dark:border-neutral-700"
          }`}
        >
          <option value="" disabled>
            Select status…
          </option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.status && (
          <p
            id="error-status"
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.status}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setValues(initialValues);
            setErrors({});
            setFormMessage(null);
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:bg-red-600 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
          disabled={submitting}
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          Save animal
        </button>
      </div>
    </form>
  );
}
