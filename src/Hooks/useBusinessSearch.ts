
import { useState } from "react";
import { MissionT } from "../App";

export function useBusinessSearch(initialItems: MissionT[]) {
	// ...existing code (if any)...
	const [search, setSearch] = useState("");

	const filteredData = initialItems.filter((item) => {

		if(item.chauffeur_name?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.license_plate?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.locations.from?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.locations.to?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.w.MIS_HEURE_DEBUT?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.w.MIS_HEURE_FIN?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.car_brand?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.w.MIS_STATUT?.toLowerCase().includes(search.toLowerCase())) return true;
		if(item.passenger?.toLowerCase().includes(search.toLowerCase())) return true;

		return false;
	});

	return { search, setSearch, filteredData };
}