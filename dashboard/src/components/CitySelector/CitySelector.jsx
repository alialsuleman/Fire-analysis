import { useState } from "react";
import "./CitySelector.css"; // استيراد ملف التنسيق

const CitySelector = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [cityList, setCityList] = useState([]);

    const cities = ["Dam", "aleppo", "Homs", "latak", "hama"];

    const asdasd = (city) => {
        console.log("تم اختيار المدين", city);
    };

    const handleChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        asdasd(city);

        // التحقق من عدم تكرار المدينة

        const newCity = {
            cityName: city,
            radius: Math.floor(Math.random() * 50) + 10, // قيمة عشوائية بين 10 و 50
            status: Math.random() > 0.5 ? "active" : "not", // تحديد الحالة عشوائيًا
            startedAt: new Date().toLocaleString({
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // تنسيق 24 ساعة
            }),
        };
        setCityList([...cityList, newCity]);

    };

    return (
        <div className="city-selector-container">
            {/* القائمة المنسدلة */}
            <label className="city-label">select country  :  </label>
            <select className="city-dropdown" value={selectedCity} onChange={handleChange}>
                <option value="">-- select country --</option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}
            </select>

            {/* جدول عرض البيانات */}
            {cityList.length > 0 && (
                <div className="city-table-container">

                    <table className="city-table">
                        <thead>
                            <tr>
                                <th> country name </th>
                                <th>raduis (M)</th>
                                <th>status</th>
                                <th>startedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cityList.map((city, index) => (
                                <tr key={index} className={city.status === "active" ? "active-row" : "inactive-row"}>
                                    <td>{city.cityName}</td>
                                    <td>{city.radius}</td>
                                    <td className={`status ${city.status}`}>{city.status}</td>
                                    <td>{city.startedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CitySelector;
