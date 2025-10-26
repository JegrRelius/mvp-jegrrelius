// Google Cloud Function: Funciones de Relius para el Backend
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

// Inicializar la aplicación de Firebase
admin.initializeApp();
const db = admin.firestore();

// --- Función para obtener datos del Dashboard ---
exports.getAdminDashboardData = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const pendingSnapshot = await db.collection("documentTasks").where("status", "==", "pending").get();
    const approvedSnapshot = await db.collection("documentTasks").where("status", "==", "approved").get();
    const rejectedSnapshot = await db.collection("documentTasks").where("status", "==", "rejected").get();
    const companiesSnapshot = await db.collection("companies").get();
    
    return res.status(200).json({
      pendingCount: pendingSnapshot.size,
      approvedCount: approvedSnapshot.size,
      rejectedCount: rejectedSnapshot.size,
      companyCount: companiesSnapshot.size,
    });
  } catch (error) {
    console.error("Error en getAdminDashboardData:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Función para crear una nueva empresa ---
exports.createCompany = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la empresa es requerido' });
    }
    const companyRef = await db.collection('companies').add({
      name: name,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: 'Empresa creada con éxito', companyId: companyRef.id });
  } catch (error) {
    console.error('Error al crear la empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// --- Función para rechazar un documento ---
exports.rejectDocument = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const { taskId, rejectionReason } = req.body;
    if (!taskId || !rejectionReason) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }
    const taskRef = db.collection("documentTasks").doc(taskId);
    await taskRef.update({
      status: "rejected",
      rejectionReason,
    });
    return res.status(200).json({ message: "Documento rechazado correctamente" });
  } catch (error) {
    console.error("Error en rejectDocument:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Función para aprobar un documento ---
exports.approveDocument = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "Falta taskId" });
    }
    const taskRef = db.collection("documentTasks").doc(taskId);
    await taskRef.update({
      status: "approved",
    });
    return res.status(200).json({ message: "Documento aprobado correctamente" });
  } catch (error) {
    console.error("Error en approveDocument:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Función para obtener la lista de empresas ---
exports.getCompanies = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const companiesSnapshot = await db.collection('companies').orderBy('createdAt', 'desc').get();
    const companiesList = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    }));
    res.status(200).json(companiesList);
  } catch (error) {
    console.error('Error al obtener las empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- Función para obtener los detalles de UNA empresa ---
exports.getCompanyDetails = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const companyId = req.query.id;
    if (!companyId) {
      return res.status(400).json({ error: 'Falta el ID de la empresa' });
    }
    const companyRef = db.collection('companies').doc(companyId);
    const doc = await companyRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    const documentsSnapshot = await db.collection('documentTasks')
                                          .where('companyId', '==', companyId)
                                          .get();
    const documentsList = documentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json({ 
      id: doc.id, 
      name: doc.data().name,
      documents: documentsList 
    });
  } catch (error) {
    console.error('Error al obtener detalles de la empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- FUNCIÓN ACTUALIZADA ---
exports.createDocumentTask = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Ahora esperamos también la URL del archivo
    const { documentName, companyId, downloadURL } = req.body;

    if (!documentName || !companyId || !downloadURL) {
      return res.status(400).json({ error: 'Faltan parámetros (documentName, companyId, downloadURL)' });
    }

    const docRef = await db.collection('documentTasks').add({
      name: documentName,
      companyId: companyId,
      downloadURL: downloadURL, // La guardamos en la base de datos
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Documento creado con éxito', documentId: docRef.id });

  } catch (error) {
    console.error('Error al crear el documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- Función para obtener las plantillas de documentos ---
exports.getDocumentTemplates = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const templatesSnapshot = await db.collection('documentTemplates').get();
    const templatesList = templatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(templatesList);
  } catch (error) {
    console.error('Error al obtener las plantillas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});