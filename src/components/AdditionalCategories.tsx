import { useState } from "react";

type Props = {
  categories: string[];
  primaryCategory: string;
  value: string[];
  onChange: (categories: string[]) => void;
};

export default function AdditionalCategories({ categories, primaryCategory, value, onChange }: Props) {
  const [enabled, setEnabled] = useState(value.length > 0);
  const options = [...new Set([...categories, ...value])].filter((name) => name !== primaryCategory);

  return (
    <div className="ad-field">
      <label className="ad-checkbox-row">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            setEnabled(event.target.checked);
            if (!event.target.checked) onChange([]);
          }}
        />
        <span className="ad-checkbox-label">Also add to other categories</span>
      </label>
      {enabled && (
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="ad-label">Also show in</legend>
          {options.map((name) => (
            <label key={name} className="ad-checkbox-row">
              <input
                type="checkbox"
                checked={value.includes(name)}
                disabled={!value.includes(name) && value.length >= 10}
                onChange={(event) => onChange(event.target.checked
                  ? [...value, name]
                  : value.filter((category) => category !== name))}
              />
              <span className="ad-checkbox-label">{name}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}