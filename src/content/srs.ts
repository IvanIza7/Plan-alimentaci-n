export const SRS_CONTENT = `
# DOCUMENTO MAESTRO — PLANIFICADOR NUTRICIONAL

**Sistema de planificación, seguimiento, inventario y equivalencias alimentarias**

**Versión:** 1.0  
**Tipo:** Especificación funcional + UX/UI  
**Plataforma principal:** Mobile-first / Web App Responsive  
**Estilo:** Scandi / Soft Neo-Brutalist  
**Objetivo:** Facilitar la adherencia y organización de un plan nutricional previamente establecido por una nutrióloga.

---

## 1. Resumen ejecutivo
El Planificador Nutricional es una aplicación diseñada para facilitar el seguimiento de un plan alimenticio prescrito por un profesional. Su objetivo principal es resolver la organización diaria, el control de inventario y la gestión de compras, respondiendo a las preguntas: *¿Qué debo comer? ¿Tengo lo necesario? ¿Qué puedo sustituir? ¿Qué necesito comprar?* Todo ello respetando estrictamente las indicaciones nutricionales y permitiendo variaciones controladas a través de un sistema de equivalencias autorizadas.

## 2. Descripción del problema
El usuario cuenta con un plan nutricional pero enfrenta dificultades operativas en su día a día:
- Desconocimiento de qué menú preparar con los ingredientes disponibles.
- Dificultad para identificar alimentos faltantes.
- Falta de organización semanal.
- Riesgo de romper la dieta al realizar sustituciones no autorizadas.
- El seguimiento del progreso (mediciones corporales) y la generación de listas de compras son procesos manuales propensos a errores.

## 3. Objetivos
- Proveer una herramienta visual y práctica de planificación semanal de menús.
- Controlar el inventario de alimentos y automatizar la generación de listas de compras.
- Permitir la sustitución de alimentos de forma segura mediante equivalencias predefinidas.
- Registrar el cumplimiento diario de las comidas.
- Mantener un historial inmutable del progreso corporal y de los menús consumidos.

## 4. Alcance
El sistema abarcará la gestión de perfiles de usuario, registro de mediciones corporales, catálogo de alimentos y equivalencias, creación y asignación de menús, control de inventario, lista de compras dinámica y dashboard de seguimiento. 

## 5. Fuera de alcance
- Generación automática de planes nutricionales o dietas (IA médica).
- Diagnósticos médicos o sugerencias de salud.
- Integración con wearables o dispositivos de medición en la fase inicial.
- Compra automatizada en supermercados o conexión a APIs de delivery.

## 6. Actores
- **Usuario:** Persona que sigue el plan nutricional. Consulta menús, registra inventario, genera listas de compra y registra su cumplimiento.
- **Nutrióloga / Administrador:** Profesional que define el plan, los menús base, las equivalencias y los rangos de mediciones deseables. *(Nota: En el MVP, estos roles pueden unificarse en una administración de datos inicial, pero el modelo de datos debe soportar la separación).*

## 7. Glosario
- **Plan Nutricional:** Conjunto de reglas y parámetros definidos por el profesional.
- **Menú:** Combinación completa de comidas para un día.
- **Comida:** Momento de ingesta (ej. Desayuno, Colación, Cena).
- **Elemento Alimentario:** Slot o requerimiento abstracto dentro de una comida (ej. "Porción de fruta").
- **Alimento:** Ingrediente físico y específico (ej. "Melón").
- **Equivalencia:** Relación autorizada que permite sustituir un alimento por otro respetando su valor nutricional.
- **Inventario:** Alimentos disponibles físicamente en casa.

## 8. Reglas de negocio
- **RN-01 Repetición de menú:** Un menú puede repetirse un máximo de dos veces consecutivas.
- **RN-02 Integridad del menú:** Los platillos de un menú son una unidad lógica; no se pueden mezclar platillos de distintos menús arbitrariamente.
- **RN-03 Equivalencias estrictas:** El sistema no inventa equivalencias; únicamente utiliza las autorizadas.
- **RN-04 Sustitución controlada:** Solo se sustituyen elementos con equivalencia definida, mostrando siempre el origen y el sustituto.
- **RN-05 Menús derivados:** Las variaciones de una comida se generan exclusivamente mediante el motor de equivalencias de sus *Elementos Alimentarios*.
- **RN-06 Inmutabilidad histórica:** Modificar un menú base o una equivalencia actual no debe alterar retroactivamente los registros de consumo o mediciones pasadas.

## 9. Requerimientos funcionales
- **RF-001 (Must Have):** El sistema debe permitir registrar y gestionar el catálogo de Alimentos y Categorías.
- **RF-002 (Must Have):** El sistema debe permitir estructurar Menús compuestos por Comidas, y estas por Elementos Alimentarios.
- **RF-003 (Must Have):** El sistema debe permitir la asignación de Menús a los días de la semana, validando la RN-01.
- **RF-004 (Must Have):** El sistema debe gestionar el Inventario de alimentos del usuario.
- **RF-005 (Must Have):** El sistema debe calcular alimentos faltantes cruzando los Elementos del Menú asignado con el Inventario.
- **RF-006 (Must Have):** El sistema debe generar una Lista de Compras dinámica agrupada por categoría, calculando \`(Requerido - Inventario)\`.
- **RF-007 (Must Have):** El sistema debe permitir registrar el cumplimiento diario (Completada, Parcial, Omitida).
- **RF-008 (Should Have):** El sistema debe permitir registrar mediciones corporales históricas.
- **RF-009 (Should Have):** El sistema debe permitir la sustitución de un alimento por otro utilizando la tabla de Equivalencias.
- **RF-010 (Could Have):** Dashboard con visualización de progreso de adherencia y composición corporal.

## 10. Requerimientos no funcionales
- **RNF-001 Privacidad:** Los datos corporales de salud deben estar aislados por usuario y considerarse información personal (PII).
- **RNF-002 Usabilidad (UI/UX):** La interfaz debe ser **Mobile-first**, siguiendo el estilo **Scandi / Soft Neo-Brutalist** (Sage Slate, Lime). Las acciones frecuentes deben requerir pocos clics.
- **RNF-003 Rendimiento:** El cálculo de la lista de compras y evaluación de faltantes de inventario debe resolverse instantáneamente sin bloqueos de UI.
- **RNF-004 Integridad de datos:** Las modificaciones a estructuras core (Menús) no deben generar inconsistencias en los históricos de seguimiento.

## 11. Casos de uso
- **CU-001:** Registrar usuario.
- **CU-002:** Registrar medición corporal.
- **CU-003:** Consultar historial corporal.
- **CU-004:** Registrar alimento y equivalencias.
- **CU-005:** Crear menú (Estructura: Menú -> Comida -> Elemento -> Alimento).
- **CU-006:** Planificar menú semanal.
- **CU-007:** Consultar alimentos faltantes y estados (Disponible, Parcial, Faltante).
- **CU-008:** Registrar / Actualizar inventario.
- **CU-009:** Generar lista de compras.
- **CU-010:** Sustituir alimento (Generar variación de comida).
- **CU-011:** Registrar cumplimiento de comida diaria.

## 12. Criterios de aceptación
**CU-006 Planificar menú semanal (Validación RN-01):**
- **GIVEN** que el usuario asignó el Menú 1 a Lunes y Martes.
- **WHEN** el usuario intenta asignar nuevamente el Menú 1 al Miércoles.
- **THEN** el sistema debe impedir la asignación y mostrar una alerta explicando que un menú únicamente puede repetirse dos veces consecutivas.

**CU-009 Generar lista de compras:**
- **GIVEN** que el plan semanal requiere 6 huevos y el inventario registra 2 huevos.
- **WHEN** el usuario consulta la lista de compras.
- **THEN** la lista muestra 4 huevos faltantes agrupados en la categoría "Proteínas".

## 13. Modelo de datos
Entidades principales propuestas:
- \`users\`: Datos del perfil (id, nombre, config).
- \`body_measurements\`: Registro en el tiempo (fecha, peso, porcentaje_grasa, masa_magra, agua_total, bmr).
- \`foods\`: (id, nombre, categoria_id, unidad_medida, macros).
- \`food_categories\`: (id, nombre).
- \`equivalence_groups\`: Agrupadores lógicos (ej. "Frutas autorizadas 1 porción").
- \`equivalences\`: (group_id, food_id, cantidad, unidad).
- \`meal_plans\`: Plan maestro configurado por la nutrióloga.
- \`menus\`: (id, plan_id, nombre).
- \`meals\`: Momentos de consumo (id, menu_id, nombre_comida, orden).
- \`meal_elements\`: Abstracción funcional (id, meal_id, food_id_base, cantidad_base). **Fundamental para sustituciones controladas.**
- \`daily_assignments\`: (id, user_id, menu_id, fecha).
- \`inventory\`: (id, user_id, food_id, cantidad).
- \`shopping_lists\` & \`shopping_list_items\`: Control de compras y estados (checkbox).
- \`meal_tracking\`: Registro inmutable (id, user_id, meal_id, fecha, estado, snapshot_json).

## 14. Relaciones y cardinalidades
- Usuario **(1) a (N)** Mediciones corporales.
- Plan Nutricional **(1) a (N)** Menús.
- Menú **(1) a (N)** Comidas.
- Comida **(1) a (N)** Elementos Alimentarios.
- Elemento Alimentario **(N) a (1)** Alimento (base).
- Alimento **(1) a (N)** Equivalencias (mediante grupos).
- Usuario **(1) a (N)** Inventario.
- Asignación Diaria **(1) a (N)** Seguimientos de Comida (\`meal_tracking\`).

## 15. Reglas de integridad
- Eliminar un Alimento (soft delete) no debe romper Menús existentes; debe marcarse como "inactivo".
- Las cantidades de inventario no pueden ser negativas.
- Las mediciones con datos biológicamente imposibles deben ser advertidas/rechazadas en UI.

## 16. Historial y versionado
**Estrategia de Snapshot:** 
Para cumplir la RN-06, cuando una comida se marca como completada, se generará un registro en \`meal_tracking\` que incluirá un \`snapshot_json\` (o estructura derivada) con el *estado exacto* consumido en ese momento (incluyendo cualquier sustitución realizada).
De este modo, si la nutrióloga actualiza la receta base del Menú en el futuro, las estadísticas y el historial del usuario de meses anteriores no se verán alterados.

## 17. Arquitectura propuesta
- **Frontend:** React + Vite. Framework robusto, ideal para SPAs y PWAs (Progressive Web Apps).
- **Estilos:** Tailwind CSS, ideal para aplicar el Design System Soft Neo-Brutalist mediante variables precisas (radius, colores).
- **Backend / API:** Node.js + Express (o Next.js Serverless).
- **Base de Datos:** PostgreSQL. 
  - *Justificación:* El modelo requiere relaciones precisas (Plan -> Menú -> Comida -> Elemento) y consistencia en el cálculo transaccional del inventario frente a los requerimientos del menú. Una base de datos relacional es la herramienta perfecta.
- **Autenticación:** Firebase Auth o Supabase Auth.

## 18. Navegación y UX
- **Navegación principal (Bottom Nav en Móvil):** Inicio, Plan, Compras, Progreso, Perfil.
- **Interacciones:** Uso de *Bottom Sheets* para acciones rápidas (modificar inventario, sustituir alimento) para no perder el contexto visual.
- **Empty States & Error States:** Siempre contextuales y explicativos (ej. "Tu despensa está vacía. Agrega alimentos para ver qué puedes preparar").

## 19. Casos límite
1. **Sin inventario:** La lista de compras solicitará el 100% de los elementos planificados.
2. **Equivalencia eliminada/deshabilitada:** El \`snapshot\` histórico la mantiene válida para el consumo pasado. En planificaciones futuras, la UI no la ofrecerá como opción de sustitución.
3. **Cambio de cantidad en el menú base:** Los menús futuros reflejarán la nueva cantidad y alterarán la lista de compras inmediatamente.

## 20. Auditoría de consistencia
- **Estructura conceptual Menú:** Implementar el "Elemento Alimentario" resuelve la necesidad de aislar la sustitución, evitando que el usuario cambie platillos arbitrariamente.
- **Integridad histórica:** Se garantiza mediante la estrategia de "Snapshot" en la tabla \`meal_tracking\`.
- **MVP Desarrollable:** Las prioridades y fases aseguran que el core funcional (organizar, comprar, consumir) se pueda entregar rápido sin dependencias tecnológicas complejas (wearables o integraciones externas).
`;
