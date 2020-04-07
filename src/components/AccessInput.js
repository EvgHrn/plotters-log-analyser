import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import XLSX from 'xlsx';

const AccessInput = (props) => {
	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				// Do whatever you want with the file contents
				const data = new Uint8Array(reader.result);
				const workbook = XLSX.read(data, {type: 'array'});
				const sheetName = Object.keys(workbook["Sheets"])[0];
				const dataJson = XLSX.utils.sheet_to_json(workbook["Sheets"][sheetName]);
				props.setText(dataJson);
			};
			reader.readAsArrayBuffer(file);
		})
	}, []);
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{
				isDragActive ?
					<p>Перетащите сюда файл выгрузки ...</p> :
					<p>Перетащите сюда файл выгрузки или нажмите для выбора файла</p>
			}
		</div>
	)
};

export default AccessInput;