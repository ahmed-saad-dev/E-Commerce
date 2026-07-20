import axios from "axios";
import { useEffect, useState } from "react";

export function useAPI() {

    let [prands, setPrands] = useState([]);
    async function getPrands() {
        let {data} = await axios.get('https://ecommerce.routemisr.com/api/v1/brands');
        setPrands(data?.data);
    };
    useEffect(() => {
        getPrands();
    }, []);

    return {prands};
}