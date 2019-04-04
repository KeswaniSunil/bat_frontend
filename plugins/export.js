import Vue from 'vue';
Vue.prototype.$createPDF = (header, body, filename, process)=>{
    return new Promise((resolve)=>{
        if (process.browser) {
            const jsPDF = require('jspdf');
            require('jspdf-autotable');
            let doc = new jsPDF();
            doc.autoTable({ head: header, body: body });
            doc.save(filename+".pdf")
            resolve()
        }
    })
}
Vue.prototype.$createExcel = (header, body, filename, process)=>{
    return new Promise((resolve)=>{
        if (process.browser) {
            const XLSX = require('xlsx')
            let data = body
            data.unshift(header[0])
            const ws = XLSX.utils.aoa_to_sheet(data);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
			/* generate file and send to client */
			XLSX.writeFile(wb, filename+".xlsx");
            resolve()
        }
    })
}