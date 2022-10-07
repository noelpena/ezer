import Papa from 'papaparse';

import {useState} from 'react';

export default function CSV() {
  const [file, setFile ] = useState()
  
  const submitFile = (e) => {
    e.preventDefault();
    let parsedData = [];
    console.log(file[0])
    Papa.parse(file[0], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log("Finished:", results.data);
            results.data.forEach((row)=>{
                parsedData.push(row)
            })
        }}
    )
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const files = e.target.files;
          setFile(files);
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
                header: true,
                dynamicTyping: true,
                preview: 3,
              complete: function(results) {
                console.log("Finished:", results.data);
              }}
            )
          }
        }}
      />
      <br />
      <button type='submit' onClick={submitFile}>Upload file</button>
    </div>
  );
}