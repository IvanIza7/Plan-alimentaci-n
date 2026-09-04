const fs = require('fs');

let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');
code = code.replace(
  `onDelete={async () => {
                    if (firestoreMenuToEdit && deleteMenu) {
                       await deleteMenu(firestoreMenuToEdit.id);
                       setSelectedMenuId(null);
                    }
                    setShowMenuEditor(false);
                 }}`,
  `onDelete={async () => {
                    console.log("Delete triggered for:", firestoreMenuToEdit);
                    if (firestoreMenuToEdit && deleteMenu) {
                       await deleteMenu(firestoreMenuToEdit.id);
                       setSelectedMenuId(null);
                    } else {
                       console.error("Cannot delete, firestoreMenuToEdit or deleteMenu is null", { firestoreMenuToEdit, deleteMenu: !!deleteMenu, menuToEdit });
                       alert("Error: No se pudo eliminar el menú. Por favor recarga e intenta de nuevo.");
                    }
                    setShowMenuEditor(false);
                 }}`
);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
