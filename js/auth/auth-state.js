// Estado de autenticación y manejo de sesión
auth.onAuthStateChanged(async user => {
    if (user) {
        console.log('Usuario logueado:', user.email);
        
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                console.log('Rol del usuario:', userData.role);
                updateUILoggedIn(user, userData);
                
                if (userData.role === 'admin') {
                    showAdminPanel();
                } else if (userData.role === 'peluqueria') {
                    checkAndShowSalonPanel(user.uid);
                }
            } else {
                console.log('No se encontró información adicional del usuario');
                updateUILoggedIn(user, { role: 'client' });
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            updateUILoggedIn(user, { role: 'client' });
        }
    } else {
        console.log('Usuario no logueado');
        updateUILoggedOut();
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) adminPanel.remove();
        const salonPanel = document.getElementById('salonPanel');
        if (salonPanel) salonPanel.remove();
    }
}); 