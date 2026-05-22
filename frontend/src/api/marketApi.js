// // // // import API from './api';

// // // // export const getMarketPrices = async (params) => {
// // // //   const res = await API.get('/market', { params });
// // // //   return res.data;
// // // // };

// // // // export default API;

// // // import API from './api';

// // // export const getMarketPrices = async ({
// // //   state,
// // //   district,
// // //   market,
// // //   commodity,
// // //   page = 1
// // // }) => {
// // //   try {
// // //     const limit = 30;
// // //     const offset = (page - 1) * limit;

// // //     const params = {
// // //       limit,
// // //       offset
// // //     };

// // //     //  Correct filter mapping
// // //     if (state) params["filters[state.keyword]"] = state;
// // //     if (district) params["filters[district]"] = district;
// // //     if (market) params["filters[market]"] = market;
// // //     if (commodity) params["filters[commodity]"] = commodity;

// // //     const res = await API.get('/market', { params });

// // //     return {
// // //       success: true,
// // //       records: res.data.records || [],
// // //       totalRecords: res.data.total || 0
// // //     };

// // //   } catch (err) {
// // //     console.error("Market API error:", err);

// // //     return {
// // //       success: false,
// // //       records: [],
// // //       totalRecords: 0
// // //     };
// // //   }
// // // };

// // import API from './api';

// // export const getMarketPrices = async ({
// //   state,
// //   district,
// //   market,
// //   commodity,
// //   page = 1
// // }) => {
// //   try {
// //     const limit = 30;
// //     const offset = (page - 1) * limit;

// //     const params = {
// //       limit,
// //       offset
// //     };

// //     //  CLEAN VALUES (IMPORTANT)
// //     if (state) params["filters[state]"] = state.trim();
// //     if (district) params["filters[district]"] = district.trim();
// //     if (market) params["filters[market]"] = market.trim();
// //     if (commodity) params["filters[commodity]"] = commodity.trim();

// //     const res = await API.get('/api/v1/market', { params });

// //     return {
// //       success: true,
// //       records: res.data.records || [],
// //       totalRecords: res.data.total || 0
// //     };

// //   } catch (err) {
// //     console.error("Market API error:", err);
// //     return {
// //       success: false,
// //       records: [],
// //       totalRecords: 0
// //     };
// //   }
// // };

// import API from './api';

// export const getMarketPrices = async ({
//   state,
//   district,
//   market,
//   commodity,
//   page = 1
// }) => {
//   try {
//     const limit = 30;
//     const offset = (page - 1) * limit;

//     const res = await API.get('/api/v1/market', {
//       params: {
//         state,
//         district,
//         market,
//         commodity,
//         limit,
//         offset
//       }
//     });

//     return {
//       success: true,
//       records: res.data.records,
//       totalRecords: res.data.total
//     };

//   } catch (err) {
//     console.error("Proxy API error:", err);
//     return {
//       success: false,
//       records: [],
//       totalRecords: 0
//     };
//   }
// };