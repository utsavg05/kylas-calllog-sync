// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(express.json());

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const IVR_API = 'https://api.ivrsolutions.in/v1/call_logs';
// const KYLAS_BASE_URL = 'https://api.kylas.io/v1';

// app.get('/sync-call-logs', async (req, res) => {
//   try {
//     const ivrLogsRes = await axios.get(IVR_API, {
//       headers: {
//         Authorization: `Bearer ${process.env.IVR_TOKEN}`,
//       },
//     });

//     const callLogs = ivrLogsRes.data.data || [];
//     const results = [];
//     console.log('IVR response keys:', Object.keys(ivrLogsRes.data));
//     console.log('Total IVR logs fetched:', ivrLogsRes.data.data?.length);


//     for (let log of callLogs) {
//       console.log(`➡️  Processing call log for: ${log.client_no}, call_time: ${log.call_time}`);

//       // const phone = log.client_no;
//       let phone = log.client_no;
//       if (!phone) {
//         console.log(`⚠️  Missing phone number, skipping`);
//         continue;
//       }

//       // Remove any leading 0 and ensure proper format
//       phone = phone.replace(/^0+/, ''); // Remove leading zeros
//       if (!phone.startsWith('+91')) {
//         phone = `+91${phone}`;
//       }

//       if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
//         console.log(`⚠️  Skipping invalid phone number: ${phone}`);
//         continue;
//       }


//       // Search Lead
//       const searchRes = await axios.post(
//         `${KYLAS_BASE_URL}/search/lead?sort=updatedAt,desc&page=0&size=100`,
//         {
//           fields: ["firstName", "lastName", "phoneNumbers", "id"],
//           jsonRule: {
//             rules: [
//               {
//                 id: "multi_field",
//                 field: "multi_field",
//                 type: "multi_field",
//                 input: "multi_field",
//                 operator: "multi_field",
//                 value: phone
//               }
//             ],
//             condition: "AND",
//             valid: true
//           }
//         },
//         {
//           headers: {
//             'api-key': process.env.KYLAS_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const leads = searchRes.data.content || [];
//       let leadId;

//       if (leads.length > 0) {
//         leadId = leads[0].id;
//         console.log(`✅ Lead found for ${phone}: ID ${leadId}`);
//       } else {
//         // Create lead
//         const createLeadRes = await axios.post(`${KYLAS_BASE_URL}/leads`, {
//           firstName: "Lead",
//           lastName: "From IVR",
//           phoneNumbers: [{ type: "MOBILE", value: phone }],
//         }, {
//           headers: {
//             'api-key': process.env.KYLAS_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         });

//         leadId = createLeadRes.data.id;
//         console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
//       }

//       // Create call log
//       const callLogPayload = {
//         outcome: "connected",
//         startTime: new Date(log.call_time).toISOString(),
//         callType: log.call_type === "incoming" ? "incoming" : "outgoing",
//         phoneNumber: phone,
//         duration: log.call_duration,
//         notes: [
//           {
//             description: `Record ID: ${log.recordid}`,
//           },
//         ],
//         relatedTo: {
//           id: leadId,
//           entity: "lead",
//           phoneNumber: phone,
//         },
//       };

//       const createCallLogRes = await axios.post(`${KYLAS_BASE_URL}/call-logs`, callLogPayload, {
//         headers: {
//           'api-key': process.env.KYLAS_API_KEY,
//           'Content-Type': 'application/json',
//         },
//       });

//       if(createCallLogRes){

//         console.log(`📞 Call log created for lead ${leadId} - ${phone}`);
//       }
//       results.push({ phone, leadId, status: 'Call log synced' });

//       await delay(1000);
//     }

//     res.status(200).json({
//       message: 'Call logs sync completed',
//       count: results.length,
//       data: results,
//     });
//   } catch (err) {
//     console.error('❌ Error syncing call logs:', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(3001, () => {
//   console.log('🚀 Server started at http://localhost:3001');
// });






// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// app.use(express.json());

// const IVR_API = 'https://api.ivrsolutions.in/v1/call_logs';
// const KYLAS_BASE = 'https://api.kylas.io/v1';
// const DELAY = (ms) => new Promise(res => setTimeout(res, ms));

// app.get('/fetch-logs', async (req, res) => {
//   try {
//     const ivrRes = await axios.get(IVR_API, {
//       headers: {
//         Authorization: `Bearer ${process.env.IVR_TOKEN}`,
//       },
//     });

//     const data = ivrRes.data.data;
//     let finalResponse = [];
//     for (let i = 0; i < data.length; i++) {
//       const log = data[i];
//       const phone = log.client_no;
//       console.log(`📞 Processing ${i + 1}/${data.length}: ${phone}`);

//       // ✅ Step 1: Validate the phone number before proceeding
//       const isValidNumber = /^\+?\d{10,15}$/.test(phone);
//       if (!isValidNumber) {
//         console.log(`⚠️ Skipping invalid number: ${phone}`);
//         continue;
//       }

//       // ✅ Step 2: Proceed only if number is valid
//       const searchRes = await axios.post(`${KYLAS_BASE}/search/lead?sort=updatedAt,desc&page=0&size=100`,
//         {
//           fields: ["id", "firstName", "lastName", "phoneNumbers"],
//           jsonRule: {
//             rules: [
//               {
//                 id: "multi_field",
//                 field: "multi_field",
//                 type: "multi_field",
//                 input: "multi_field",
//                 operator: "multi_field",
//                 value: phone
//               }
//             ],
//             condition: "AND",
//             valid: true
//           }
//         },
//         {
//           headers: {
//             'api-key': process.env.KYLAS_API_KEY,
//             'Content-Type': 'application/json',
//           }
//         }
//       );


//       const leads = searchRes.data.content;
//       let leadId;

//       if (leads.length > 0) {
//         leadId = leads[0].id;
//         console.log(`✅ Existing Lead found: ${phone} => ID ${leadId}`);
//       } else {
//         // Create new lead
//         const leadRes = await axios.post(`${KYLAS_BASE}/leads`, {
//           firstName: "Lead",
//           lastName: "From IVR",
//           phoneNumbers: [{ type: "MOBILE", value: phone }],
//         }, {
//           headers: {
//             'api-key': process.env.KYLAS_API_KEY,
//             'Content-Type': 'application/json',
//           }
//         });

//         leadId = leadRes.data.id;
//         console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
//       }

//       // Prepare call log payload
//       const callLogPayload = {
//         outcome: "connected",
//         startTime: new Date(log.call_time).toISOString(),
//         phoneNumber: phone,
//         callType: log.call_type === "incoming" ? "incoming" : "outgoing",
//         duration: log.call_duration,
//         notes: [{ description: `Record ID: ${log.recordid}` }],
//         relatedTo: {
//           id: leadId,
//           entity: "lead",
//           phoneNumber: phone
//         },
//         callRecording: log.audio_url ? {
//           url: log.audio_url,
//           fileName: `call_${log.recordid}.mp3`
//         } : undefined
//       };

//       try {
//         const postLog = await axios.post(`${KYLAS_BASE}/call-logs`, callLogPayload, {
//           headers: {
//             'api-key': process.env.KYLAS_API_KEY,
//             'Content-Type': 'application/json',
//           }
//         });
//         console.log(`📞 Call log posted: ${phone}`);
//         finalResponse.push({ phone, leadId, status: "Synced" });
//       } catch (err) {
//         console.error(`❌ Failed call log for ${phone}: ${err.message}`);
//         finalResponse.push({ phone, leadId, status: "Failed" });
//       }

//       await DELAY(1000); // Avoid hitting rate limits
//     }

//     res.status(200).json({
//       message: "Call logs synced to Kylas",
//       count: finalResponse.length,
//       data: finalResponse,
//     });

//   } catch (error) {
//     console.error("❌ Fatal error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3001, () => {
//   console.log("🚀 Server running at http://localhost:3001");
// });






// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// app.use(express.json());

// const IVR_API = 'https://api.ivrsolutions.in/v1/call_logs';
// const KYLAS_BASE = 'https://api.kylas.io/v1';
// const DELAY = (ms) => new Promise((res) => setTimeout(res, ms));

// async function retryRequest(fn, retries = 3, delay = 5000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn();
//     } catch (err) {
//       if (err.response && err.response.status === 429 && i < retries - 1) {
//         console.log(`⚠️ Rate limit hit. Retrying in ${delay / 1000}s...`);
//         await DELAY(delay);
//       } else {
//         throw err;
//       }
//     }
//   }
// }

// app.get('/fetch-logs', async (req, res) => {
//   try {
//     const ivrRes = await axios.get(IVR_API, {
//       headers: {
//         Authorization: `Bearer ${process.env.IVR_TOKEN}`,
//       },
//     });

//     const data = ivrRes.data.data;
//     const totalLogs = data.length;
//     let finalResponse = [];

//     for (let i = 0; i < totalLogs; i++) {
//       const log = data[i];
//       let rawPhone = log.client_no.trim();

//       // ✅ Normalize phone number
//       let phone = rawPhone;
//       if (/^0\d{9,}$/.test(rawPhone)) {
//         phone = `+91${rawPhone.slice(1)}`;
//       } else if (/^\d{10}$/.test(rawPhone)) {
//         phone = `+91${rawPhone}`;
//       }

//       // ✅ Validate number after normalization
//       const isValidNumber = /^\+91\d{10}$/.test(phone);
//       console.log(`📞 Processing ${i + 1}/${totalLogs}: ${rawPhone} (Normalized: ${phone})`);

//       if (!isValidNumber) {
//         console.log(`⚠️ Skipping invalid number: ${rawPhone}`);
//         continue;
//       }

//       try {
//         // ✅ Search lead in Kylas
//         const searchRes = await retryRequest(() =>
//           axios.post(
//             `${KYLAS_BASE}/search/lead?sort=updatedAt,desc&page=0&size=100`,
//             {
//               fields: ['id', 'firstName', 'lastName', 'phoneNumbers'],
//               jsonRule: {
//                 rules: [
//                   {
//                     id: 'multi_field',
//                     field: 'multi_field',
//                     type: 'multi_field',
//                     input: 'multi_field',
//                     operator: 'multi_field',
//                     value: phone,
//                   },
//                 ],
//                 condition: 'AND',
//                 valid: true,
//               },
//             },
//             {
//               headers: {
//                 'api-key': process.env.KYLAS_API_KEY,
//                 'Content-Type': 'application/json',
//               },
//             }
//           )
//         );

//         const leads = searchRes.data.content;
//         let leadId;

//         if (leads.length > 0) {
//           leadId = leads[0].id;
//           console.log(`✅ Existing Lead found: ${phone} => ID ${leadId}`);
//         } else {
//           // ✅ Create new lead
//           const leadRes = await retryRequest(() =>
//             axios.post(
//               `${KYLAS_BASE}/leads`,
//               {
//                 firstName: 'Lead',
//                 lastName: 'From IVR',
//                 phoneNumbers: [{ type: 'MOBILE', value: phone }],
//               },
//               {
//                 headers: {
//                   'api-key': process.env.KYLAS_API_KEY,
//                   'Content-Type': 'application/json',
//                 },
//               }
//             )
//           );

//           leadId = leadRes.data.id;
//           console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
//         }

//         // ✅ Prepare call log payload
//         const callLogPayload = {
//           outcome: 'connected',
//           startTime: new Date(log.call_time).toISOString(),
//           phoneNumber: phone,
//           callType: log.call_type === 'incoming' ? 'incoming' : 'outgoing',
//           duration: log.call_duration,
//           notes: [{ description: `Record ID: ${log.recordid}` }],
//           relatedTo: {
//             id: leadId,
//             entity: 'lead',
//             phoneNumber: phone,
//           },
//           callRecording: log.audio_url
//             ? {
//                 url: log.audio_url,
//                 fileName: `call_${log.recordid}.mp3`,
//               }
//             : undefined,
//         };

//         await retryRequest(() =>
//           axios.post(`${KYLAS_BASE}/call-logs`, callLogPayload, {
//             headers: {
//               'api-key': process.env.KYLAS_API_KEY,
//               'Content-Type': 'application/json',
//             },
//           })
//         );

//         console.log(`📞 Call log posted: ${phone}`);
//         finalResponse.push({ phone, leadId, status: 'Synced' });
//       } catch (err) {
//         console.error(`❌ Lead search/create failed for ${phone}: ${err.message}`);
//         finalResponse.push({ phone, status: 'Failed', error: err.message });
//       }

//       await DELAY(3000); // Delay between requests to avoid rate limit
//     }

//     res.status(200).json({
//       message: 'Call logs synced to Kylas',
//       total: totalLogs,
//       processed: finalResponse.length,
//       data: finalResponse,
//     });
//   } catch (error) {
//     console.error('❌ Fatal error:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3001, () => {
//   console.log('🚀 Server running at http://localhost:3001');
// });






// import express from "express";
// import axios from "axios";
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(express.json());

// const IVR_API = "https://api.ivrsolutions.in/v1/call_logs";
// const KYLAS_BASE = "https://api.kylas.io/v1";
// const DELAY = (ms) => new Promise((res) => setTimeout(res, ms));
// const LAST_RECORD_FILE = "./lastRecord.json";

// // ✅ Utility to read lastRecordId
// function getLastRecordId() {
//   if (fs.existsSync(LAST_RECORD_FILE)) {
//     const data = JSON.parse(fs.readFileSync(LAST_RECORD_FILE));
//     return data.lastRecordId || null;
//   }
//   return null;
// }

// // ✅ Utility to save lastRecordId
// function saveLastRecordId(recordId) {
//   fs.writeFileSync(LAST_RECORD_FILE, JSON.stringify({ lastRecordId: recordId }));
// }

// app.get("/fetch-logs", async (req, res) => {
//   try {
//     // 1️⃣ Fetch call logs from IVR
//     const ivrRes = await axios.get(IVR_API, {
//       headers: {
//         Authorization: `Bearer ${process.env.IVR_TOKEN}`,
//       },
//     });

//     const data = ivrRes.data.data;
//     const length = data.length;
//     console.log(`✅ Total logs fetched: ${length}`);

//     if (length === 0) {
//       return res.status(200).json({ message: "No logs found", count: 0 });
//     }

//     // 2️⃣ Find last processed recordId
//     const lastRecordId = getLastRecordId();
//     let startIndex = length - 1; // Default: process all if no lastRecordId found

//     if (lastRecordId) {
//       for (let i = length - 1; i >= 0; i--) {
//         if (data[i].recordid === lastRecordId) {
//           startIndex = i - 1;
//           break;
//         }
//       }
//     }

//     console.log(`Starting sync from index: ${startIndex}`);

//     let finalResponse = [];
//     for (let i = startIndex; i >= 0; i--) {
//       const log = data[i];
//       const phone = log.client_no;

//       console.log(`📞 Processing ${length - i}/${length}: ${phone}`);

//       // ✅ Validate number
//       const isValidNumber = /^\+?\d{10,15}$/.test(phone);
//       if (!isValidNumber) {
//         console.log(`⚠️ Skipping invalid number: ${phone}`);
//         continue;
//       }

//       try {
//         // ✅ Search lead in Kylas
//         const searchRes = await axios.post(
//           `${KYLAS_BASE}/search/lead?sort=updatedAt,desc&page=0&size=100`,
//           {
//             fields: ["id", "firstName", "lastName", "phoneNumbers"],
//             jsonRule: {
//               rules: [
//                 {
//                   id: "multi_field",
//                   field: "multi_field",
//                   type: "multi_field",
//                   input: "multi_field",
//                   operator: "multi_field",
//                   value: phone,
//                 },
//               ],
//               condition: "AND",
//               valid: true,
//             },
//           },
//           {
//             headers: {
//               "api-key": process.env.KYLAS_API_KEY,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const leads = searchRes.data.content;
//         let leadId;

//         if (leads.length > 0) {
//           leadId = leads[0].id;
//           console.log(`✅ Existing Lead found: ${phone} => ID ${leadId}`);
//         } else {
//           // Create new lead
//           const leadRes = await axios.post(
//             `${KYLAS_BASE}/leads`,
//             {
//               firstName: "Lead",
//               lastName: "From IVR",
//               phoneNumbers: [{ type: "MOBILE", value: phone }],
//             },
//             {
//               headers: {
//                 "api-key": process.env.KYLAS_API_KEY,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           leadId = leadRes.data.id;
//           console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
//         }

//         // ✅ Create call log
//         const callLogPayload = {
//           outcome: "connected",
//           startTime: new Date(log.call_time).toISOString(),
//           phoneNumber: phone,
//           callType: log.call_type === "incoming" ? "incoming" : "outgoing",
//           duration: log.call_duration,
//           notes: [{ description: `Record ID: ${log.recordid}` }],
//           relatedTo: {
//             id: leadId,
//             entity: "lead",
//             phoneNumber: phone,
//           },
//           callRecording: log.audio_url
//             ? {
//                 url: log.audio_url,
//                 fileName: `call_${log.recordid}.mp3`,
//               }
//             : undefined,
//         };

//         await axios.post(`${KYLAS_BASE}/call-logs`, callLogPayload, {
//           headers: {
//             "api-key": process.env.KYLAS_API_KEY,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log(`📞 Call log posted: ${phone}`);
//         finalResponse.push({ phone, leadId, status: "Synced" });

//         await DELAY(4000); // Avoid hitting rate limits
//       } catch (err) {
//         console.error(`❌ Lead search/create failed for ${phone}: ${err.message}`);
//         finalResponse.push({ phone, status: "Failed" });
//       }
//     }

//     // ✅ Save latest recordId for next run
//     saveLastRecordId(data[0].recordid);

//     res.status(200).json({
//       message: "Call logs synced to Kylas",
//       count: finalResponse.length,
//       data: finalResponse,
//       lastRecordId: data[0].recordid,
//     });
//   } catch (error) {
//     console.error("❌ Fatal error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3001, () => {
//   console.log("🚀 Server running at http://localhost:3001");
// });









// import express from "express";
// import axios from "axios";
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(express.json());

// const IVR_API = "https://api.ivrsolutions.in/v1/call_logs";
// const KYLAS_BASE = "https://api.kylas.io/v1";
// const DELAY = (ms) => new Promise((res) => setTimeout(res, ms));
// const LAST_RECORD_FILE = "./lastRecord.json";

// /* -------------------- Helpers -------------------- */

// // Fetch token from DB or env (for now using env)
// function getAccessToken() {
//   return process.env.KYLAS_ACCESS_TOKEN; // Replace with DB logic for per-account tokens
// }

// // Read last processed recordId from file
// function getLastRecordId() {
//   try {
//     if (fs.existsSync(LAST_RECORD_FILE)) {
//       const data = JSON.parse(fs.readFileSync(LAST_RECORD_FILE, "utf8"));
//       return data.lastRecordId || null;
//     }
//   } catch (e) {
//     console.error("⚠️ Could not read lastRecordId file:", e.message);
//   }
//   return null;
// }

// // Save last processed recordId
// function saveLastRecordId(recordId) {
//   try {
//     fs.writeFileSync(
//       LAST_RECORD_FILE,
//       JSON.stringify({ lastRecordId: recordId }, null, 2)
//     );
//     console.log(`💾 Saved lastRecordId: ${recordId}`);
//   } catch (e) {
//     console.error("⚠️ Failed to write lastRecordId file:", e.message);
//   }
// }

// // Normalize a raw phone string from IVR into +91XXXXXXXXXX
// function normalizePhone(raw) {
//   if (!raw) return null;
//   let num = String(raw).trim();

//   if (num.startsWith("+")) {
//     num = "+" + num.replace(/[^\d]/g, "").replace(/^\+?/, "");
//   } else {
//     num = num.replace(/\D/g, "");
//   }
//   num = num.replace(/^0+/, "");

//   if (num.startsWith("91") && num.length === 12) {
//     num = "+" + num;
//   } else if (num.length === 10) {
//     num = "+91" + num;
//   }

//   if (!/^\+91\d{10}$/.test(num)) {
//     return null;
//   }
//   return num;
// }

// /* -------------------- Route -------------------- */

// app.get("/fetch-logs", async (req, res) => {
//   const fullSync = req.query.fullSync === "true";

//   try {
//     console.log("🔍 Fetching call logs from IVR...");
//     const ivrRes = await axios.get(IVR_API, {
//       headers: { Authorization: `Bearer ${process.env.IVR_TOKEN}` },
//     });

//     const data = ivrRes.data?.data || [];
//     const length = data.length;
//     console.log(`✅ Total logs fetched: ${length}`);

//     if (length === 0) {
//       return res.status(200).json({ message: "No logs found", count: 0 });
//     }

//     let startIndex = length - 1;
//     const lastRecordId = getLastRecordId();

//     if (!fullSync && lastRecordId) {
//       for (let i = length - 1; i >= 0; i--) {
//         if (data[i].recordid === lastRecordId) {
//           startIndex = i - 1;
//           break;
//         }
//       }
//     } else if (fullSync) {
//       console.log("⚠️ Running FULL SYNC (ignoring lastRecordId).");
//     }

//     if (startIndex < 0) {
//       console.log("✅ No new logs since last sync.");
//       return res.status(200).json({
//         message: "No new logs to sync",
//         lastRecordId,
//         count: 0,
//       });
//     }

//     const newLogsCount = startIndex + 1;
//     console.log(`✅ Found ${newLogsCount} new logs to sync.`);
//     console.log(`Starting sync from index: ${startIndex}`);

//     const finalResponse = [];
//     const groupedData = {};
//     const accessToken = getAccessToken();

//     for (let processed = 0; processed < newLogsCount; processed++) {
//       const i = startIndex - processed;
//       const log = data[i];
//       const rawPhone = log.client_no;
//       const phone = normalizePhone(rawPhone);

//       console.log(
//         `📞 Processing ${processed + 1}/${newLogsCount}: raw=${rawPhone} | normalized=${phone}`
//       );

//       if (!phone) {
//         console.log(`⚠️ Skipping invalid/un-normalizable number: ${rawPhone}`);
//         continue;
//       }

//       if (!groupedData[phone]) groupedData[phone] = 0;
//       groupedData[phone]++;

//       try {
//         // Search for lead
//         const searchRes = await axios.post(
//           `${KYLAS_BASE}/search/lead?sort=updatedAt,desc&page=0&size=100`,
//           {
//             fields: ["id", "firstName", "lastName", "phoneNumbers"],
//             jsonRule: {
//               rules: [
//                 {
//                   id: "multi_field",
//                   field: "multi_field",
//                   type: "multi_field",
//                   input: "multi_field",
//                   operator: "multi_field",
//                   value: phone,
//                 },
//               ],
//               condition: "AND",
//               valid: true,
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         let leadId;
//         const leads = searchRes.data?.content || [];
//         if (leads.length > 0) {
//           leadId = leads[0].id;
//           console.log(`✅ Existing Lead found: ${phone} => ID ${leadId}`);
//         } else {
//           // Create lead
//           const leadRes = await axios.post(
//             `${KYLAS_BASE}/leads`,
//             {
//               firstName: "Lead",
//               lastName: "From IVR",
//               phoneNumbers: [{ type: "MOBILE", value: phone }],
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           leadId = leadRes.data.id;
//           console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
//         }

//         const callLogPayload = {
//           outcome: "connected",
//           startTime: new Date(log.call_time).toISOString(),
//           phoneNumber: phone,
//           callType: log.call_type === "incoming" ? "incoming" : "outgoing",
//           duration: log.call_duration,
//           notes: [{ description: `Record ID: ${log.recordid}` }],
//           relatedTo: {
//             id: leadId,
//             entity: "lead",
//             phoneNumber: phone,
//           },
//           callRecording: log.audio_url
//             ? { url: log.audio_url, fileName: `call_${log.recordid}.mp3` }
//             : undefined,
//         };

//         await axios.post(`${KYLAS_BASE}/call-logs`, callLogPayload, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log(`📞 Call log posted: ${phone}`);
//         finalResponse.push({ phone, leadId, status: "Synced" });
//       } catch (err) {
//         const msg =
//           err.response?.data?.message ||
//           err.response?.data ||
//           err.message ||
//           "Unknown error";
//         console.error(`❌ Lead search/create or log post failed for ${rawPhone}:`, msg);
//         finalResponse.push({ phone: rawPhone, status: "Failed", error: msg });
//       }

//       await DELAY(3000);
//     }

//     saveLastRecordId(data[0].recordid);

//     const summary = Object.keys(groupedData).map((p) => ({
//       phone: p,
//       logsProcessed: groupedData[p],
//     }));

//     res.status(200).json({
//       message: "Call logs synced to Kylas",
//       totalLogsProcessed: finalResponse.length,
//       uniqueNumbersProcessed: Object.keys(groupedData).length,
//       groupedSummary: summary,
//       lastRecordId: data[0].recordid,
//       fullSync,
//     });
//   } catch (error) {
//     console.error("❌ Fatal error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3001, () => console.log("🚀 Server running at http://localhost:3001"));






import express from "express";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const IVR_API = "https://api.ivrsolutions.in/v1/call_logs";
const KYLAS_BASE = "https://api.kylas.io/v1";
const DELAY = (ms) => new Promise((res) => setTimeout(res, ms));
const LAST_RECORD_FILE = "./lastRecord.json";

/* -------------------- Helpers -------------------- */

// Fetch token from DB or env (for now using env)
function getAccessToken() {
  return process.env.KYLAS_ACCESS_TOKEN; // Replace with DB logic for per-account tokens
}

// Read last processed recordId from file
function getLastRecordId() {
  try {
    if (fs.existsSync(LAST_RECORD_FILE)) {
      const data = JSON.parse(fs.readFileSync(LAST_RECORD_FILE, "utf8"));
      return data.lastRecordId || null;
    }
  } catch (e) {
    console.error("⚠️ Could not read lastRecordId file:", e.message);
  }
  return null;
}

// Save last processed recordId
function saveLastRecordId(recordId) {
  try {
    fs.writeFileSync(
      LAST_RECORD_FILE,
      JSON.stringify({ lastRecordId: recordId }, null, 2)
    );
    console.log(`💾 Saved lastRecordId: ${recordId}`);
  } catch (e) {
    console.error("⚠️ Failed to write lastRecordId file:", e.message);
  }
}

// Normalize a raw phone string from IVR into +91XXXXXXXXXX
function normalizePhone(raw) {
  if (!raw) return null;
  let num = String(raw).trim();

  if (num.startsWith("+")) {
    num = "+" + num.replace(/[^\d]/g, "").replace(/^\+?/, "");
  } else {
    num = num.replace(/\D/g, "");
  }
  num = num.replace(/^0+/, "");

  if (num.startsWith("91") && num.length === 12) {
    num = "+" + num;
  } else if (num.length === 10) {
    num = "+91" + num;
  }

  if (!/^\+91\d{10}$/.test(num)) {
    return null;
  }
  return num;
}

/* -------------------- Route -------------------- */

app.get("/fetch-logs", async (req, res) => {
  const fullSync = req.query.fullSync === "true";

  try {
    console.log("🔍 Fetching call logs from IVR...");
    const ivrRes = await axios.get(IVR_API, {
      headers: { Authorization: `Bearer ${process.env.IVR_TOKEN}` },
    });

    const data = ivrRes.data?.data || [];
    const length = data.length;
    console.log(`✅ Total logs fetched: ${length}`);

    if (length === 0) {
      return res.status(200).json({ message: "No logs found", count: 0 });
    }

    let startIndex = length - 1;
    const lastRecordId = getLastRecordId();

    if (!fullSync && lastRecordId) {
      for (let i = length - 1; i >= 0; i--) {
        if (data[i].recordid === lastRecordId) {
          startIndex = i - 1;
          break;
        }
      }
    } else if (fullSync) {
      console.log("⚠️ Running FULL SYNC (ignoring lastRecordId).");
    }

    if (startIndex < 0) {
      console.log("✅ No new logs since last sync.");
      return res.status(200).json({
        message: "No new logs to sync",
        lastRecordId,
        count: 0,
      });
    }

    const newLogsCount = startIndex + 1;
    console.log(`✅ Found ${newLogsCount} new logs to sync.`);
    console.log(`Starting sync from index: ${startIndex}`);

    const finalResponse = [];
    const groupedData = {};
    const accessToken = getAccessToken();

    for (let processed = 0; processed < newLogsCount; processed++) {
      const i = startIndex - processed;
      const log = data[i];
      const rawPhone = log.client_no;
      const phone = normalizePhone(rawPhone);

      console.log(
        `📞 Processing ${processed + 1}/${newLogsCount}: raw=${rawPhone} | normalized=${phone}`
      );

      if (!phone) {
        console.log(`⚠️ Skipping invalid/un-normalizable number: ${rawPhone}`);
        continue;
      }

      if (!groupedData[phone]) groupedData[phone] = 0;
      groupedData[phone]++;

      try {
        // Search for lead
        const searchRes = await axios.post(
          `${KYLAS_BASE}/search/lead?sort=updatedAt,desc&page=0&size=100`,
          {
            fields: ["id", "firstName", "lastName", "phoneNumbers"],
            jsonRule: {
              rules: [
                {
                  id: "multi_field",
                  field: "multi_field",
                  type: "multi_field",
                  input: "multi_field",
                  operator: "multi_field",
                  value: phone,
                },
              ],
              condition: "AND",
              valid: true,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        let leadId;
        const leads = searchRes.data?.content || [];
        if (leads.length > 0) {
          leadId = leads[0].id;
          console.log(`✅ Existing Lead found: ${phone} => ID ${leadId}`);
        } else {
          // Create lead
          const leadRes = await axios.post(
            `${KYLAS_BASE}/leads`,
            {
              firstName: "Lead",
              lastName: "From IVR",
              phoneNumbers: [{ type: "MOBILE", value: phone }],
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          leadId = leadRes.data.id;
          console.log(`➕ Created new lead for ${phone}: ID ${leadId}`);
        }

        const callLogPayload = {
          outcome: "connected",
          startTime: new Date(log.call_time).toISOString(),
          phoneNumber: phone,
          callType: log.call_type === "incoming" ? "incoming" : "outgoing",
          duration: log.call_duration,
          notes: [{ description: `Record ID: ${log.recordid}` }],
          relatedTo: {
            id: leadId,
            entity: "lead",
            phoneNumber: phone,
          },
          callRecording: log.audio_url
            ? { url: log.audio_url, fileName: `call_${log.recordid}.mp3` }
            : undefined,
        };

        await axios.post(`${KYLAS_BASE}/call-logs`, callLogPayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`📞 Call log posted: ${phone}`);
        finalResponse.push({ phone, leadId, status: "Synced" });
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Unknown error";
        console.error(`❌ Lead search/create or log post failed for ${rawPhone}:`, msg);
        finalResponse.push({ phone: rawPhone, status: "Failed", error: msg });
      }

      await DELAY(3000);
    }

    saveLastRecordId(data[0].recordid);

    const summary = Object.keys(groupedData).map((p) => ({
      phone: p,
      logsProcessed: groupedData[p],
    }));

    res.status(200).json({
      message: "Call logs synced to Kylas",
      totalLogsProcessed: finalResponse.length,
      uniqueNumbersProcessed: Object.keys(groupedData).length,
      groupedSummary: summary,
      lastRecordId: data[0].recordid,
      fullSync,
    });
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("🚀 Server running at http://localhost:3001"));