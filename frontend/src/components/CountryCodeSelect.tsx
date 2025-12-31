import React from 'react';
import countryCodes from '../data/countryCodes.json';

interface CountryCodeSelectProps {
    value: string;
    onChange: (code: string) => void;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Select country code"
            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT bg-white text-gray-700"
        >
            {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                    {country.flag} {country.code} ({country.name})
                </option>
            ))}
        </select>
    );
};

export default CountryCodeSelect;
