// Estado de autenticación y manejo de sesión
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    auth.onAuthStateChanged(async user => {
        if (user) {
            console.log('Usuario logueado:', user.email);
            
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (!userDoc.exists) {
                    console.log('No se encontró información del usuario');
                    auth.signOut();
                    window.location.href = '../index.html';
                    return;
                }

                const userData = userDoc.data();
                console.log('Rol del usuario:', userData.role);
                
                // Verificar si el usuario es admin o una peluquería activa
                if (userData.role === 'admin') {
                    updateUILoggedIn(user, userData);
                } else if (userData.role === 'peluqueria') {
                    if (userData.isActive === false) {
                        // Si la peluquería está inactiva, cerrar sesión y mostrar mensaje
                        await auth.signOut();
                        showErrorMessage('Tu cuenta está inactiva por falta de pago. Por favor, contacta con el administrador.');
                        window.location.href = '../index.html';
                        return;
                    }
                    updateUILoggedIn(user, userData);
                } else {
                    window.location.href = '../index.html';
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                auth.signOut();
                window.location.href = '../index.html';
            }
        } else {
            console.log('Usuario no logueado');
            updateUILoggedOut();
        }
    });
}); 