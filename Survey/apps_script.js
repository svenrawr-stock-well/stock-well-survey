
// Google Apps Script backend to save submissions to a Google Sheet
const SHEET_NAME = 'Responses';
const ALLOW_ORIGIN = '*';

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['timestamp','machine_id','choices_json','suggestion','user_agent','ip']);
    }
    const machineId = (body.machine_id || 'UNKNOWN').toString();
    const choices = Array.isArray(body.choices) ? body.choices : [];
    const suggestion = typeof body.suggestion === 'string' ? body.suggestion.slice(0,240) : '';
    const ua = typeof body.ua === 'string' ? body.ua : '';
    const ip = '';
    sh.appendRow([new Date(),machineId,JSON.stringify(choices),suggestion,ua,ip]);
    return cors_(ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON));
  } catch(err) {
    return cors_(ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON));
  }
}
function doGet() {
  return cors_(ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON));
}
function cors_(output) {
  const headers = output.getHeaders();
  headers['Access-Control-Allow-Origin'] = ALLOW_ORIGIN;
  headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
  return output;
}
