import JSZip from "jszip";

// Helper functions to format date (YYYY-MM-DD)
export function formatDate(dateString) {
    if (dateString == null) return "";
    // Create a new Date object from the date string
    let date = new Date(dateString);
    // Get the year, month and day from the date object
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Month is zero-based, so add one
    let day = date.getDate();
    // Pad the month and day with leading zeros if needed
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    // Return the formatted date string
    return year + "-" + month + "-" + day;
}

// Helper function to format a name (LAST, first)
export function formatName(last_name, first_name) {
    if (last_name == null || first_name == null) return "";
    return last_name.toUpperCase() + ", " + first_name;
}

// Helper function to format an enum
export function formatEnum(val) {
    if (val == null) return "";
    return val
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

// Helper function to add non-duplicate items to an array
export function addUnique(arr, item) {
    if (arr.indexOf(item) === -1) {
        arr.push(item);
    }
}

// Helper function to download CSV file from provided CSV string
export function downloadCSV(csvString, filename) {
    // If csv is empty, do nothing
    if (csvString == null || csvString.length === 0) 
        return;

    // Add .csv extension to filename if not already present
    if (!filename.endsWith(".csv")) filename += ".csv";

    // CSV file download

    // Create download link element
    let downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(
        new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    );
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    // Delete the link from DOM
    document.body.removeChild(downloadLink);
}

// Helper function to format CSV string for download
export function formatCSVString(str) {
    // If string is empty, return empty string
    if (str == null || str.length === 0) 
        return "";
    
    // If string contains a double quote, replace with two double quotes
    if (str.indexOf('"') !== -1) {
        str = str.replace(/"/g, '""');
    }

    // Return string
    return `"${str}"`;
}

// Helper function to download ZIP file
export async function downloadZIP(zipString, filename) {
    // If zip is empty, do nothing
    if (zipString == null || zipString.length === 0) return;

    // Add .zip extension to filename if not already present
    if (!filename.endsWith(".zip")) filename += ".zip";

    // ZIP file download

    // Convert base64 string to blob
    const zip = new JSZip();
    await zip.loadAsync(zipString, { base64: true });
    const blob = await zip.generateAsync({ type: "blob" });

    // Download link
    let downloadLink = document.createElement("a");
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(blob);
    // File name
    downloadLink.download = filename;
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    // Delete the link from DOM
    document.body.removeChild(downloadLink);
}

// Helper function to download PDF file
export function downloadPDF(pdfString, filename) {

    // If pdfString is empty, do nothing
    if (pdfString == null || pdfString == undefined) return;

    // Add .pdf extension to filename if not already present
    if (!filename.endsWith(".pdf")) filename += ".pdf";

    // Convert base64 string to binary data
    let pdfData = atob(pdfString);
    let pdfArray = new Uint8Array(new ArrayBuffer(pdfData.length));

    for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
    }

    // Create a Blob from the PDF data
    let blob = new Blob([pdfArray], { type: 'application/pdf' });

    // Download link
    let downloadLink = document.createElement("a");
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(blob);
    // File name
    downloadLink.download = filename;
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    // Delete the link from DOM
    document.body.removeChild(downloadLink);
}

//Helper function to format null in text fields
export function formatText(text) {
    if (text === null) {
        return "";
    } else {
        return text;
    }
}

//Helper function to duplicate objects (Note: This only handles primitive types, date objects, regular objects, and arrays. All other inputs will result in undefined behavior)
export const duplicate = (data) => {
    if (typeof data === "object") {
        let duplicated;
        if (Object.prototype.toString.call(data) === "[object Array]") {
            duplicated = [];

            for (const entry of data) {
                let handler = {};
                for (const [key, value] of Object.entries(entry)) {
                    if (value === null || value === undefined) {
                        handler[key] = null;
                    } else if (
                        typeof value === "object" &&
                        Object.prototype.toString.call(value) !== "[object Date]"
                    ) {
                        handler[key] = duplicate(value);
                    } else {
                        handler[key] = value;
                    }
                }
                duplicated.push(handler);
            }
        } else {
            duplicated = {};
            for (const [key, value] of Object.entries(data)) {
                if (value === null || value === undefined) {
                    duplicated[key] = null;
                } else if (
                    typeof value === "object" &&
                    Object.prototype.toString.call(value) !== "[object Date]"
                ) {
                    duplicated[key] = duplicate(value);
                } else {
                    duplicated[key] = value;
                }
            }
        }

        return duplicated;
    } else {
        return data;
    }
};
