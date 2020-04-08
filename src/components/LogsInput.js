import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

const findPlotterNumber = (fileName) => {
	const number = fileName.match(/(?<=pl)\d/);
	if(! number) {
		return false;
	} else {
		return number[0];
	}
};

const LogsInput = (props) => {

	const onDrop = useCallback((acceptedFiles) => {
		console.log("Accepted Files: ", acceptedFiles);
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				props.setText(reader.result, findPlotterNumber(file.name));
			};
			reader.readAsText(file, "CP1251");
		})
	}, []);

	const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{
				isDragActive ?
					<p>Перетащите сюда файл логов ...</p> :
					<p>Перетащите сюда файл логов или нажмите для выбора файла</p>
			}
		</div>
	)
};

export default LogsInput;