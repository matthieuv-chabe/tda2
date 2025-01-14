
export type CsvCategorizerCtorOptions = {
	colSeparator: string;
	rowSeparator: string;
}
const CsvCategorizerDefaultOptions: CsvCategorizerCtorOptions = {
	colSeparator: ',',
	rowSeparator: '\n',
}

export class CsvCategorizer {

	public constructor(csvdata: string, options: CsvCategorizerCtorOptions = CsvCategorizerDefaultOptions) {

	}

}
