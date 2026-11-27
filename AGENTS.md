# Flujo de trabajo por issue

Este repositorio trabaja con ramas efimeras por issue y Pull Requests hacia `develop`.

## Proceso obligatorio

1. Partir siempre de `develop` actualizado (`git pull --ff-only`).
2. Crear una rama efimera con el numero de issue como prefijo, por ejemplo:
   - `feature/10-registro-prestador-y-suspension`
   - `fix/9-notificacion-estados-reserva`
3. Implementar todo el trabajo de la issue en esa rama.
4. Verificar compilacion y pruebas correspondientes antes de commitear.
5. Realizar commits atomicos con Conventional Commits, sin atribucion de IA.
6. Publicar la rama y abrir un Pull Request hacia `develop`.
7. Mergear el PR a `develop`.
8. Cerrar la issue con un resumen de lo implementado.
9. Eliminar la rama efimera local y remota.

## Issues que abarcan frontend y backend

Cuando una issue requiere cambios en ambos repositorios:

- Crear una rama con el mismo numero de issue en cada repositorio.
- Abrir un PR en cada repositorio, referenciando la issue original.
- Mergear primero el backend y luego el frontend si el frontend depende de la nueva API.
- Cerrar la issue original una vez mergeados ambos PRs y eliminar ambas ramas.

## Comandos de verificacion

Frontend:

```powershell
pnpm --filter dashboard build
pnpm --filter portal-turismo build
```

Backend:

```powershell
.\mvnw.cmd test
```

## Reglas de commit

- No usar `git add .` ni `git add -A`.
- Revisar `git status` y `git diff` antes de stagear.
- Stagear solo archivos de la tarea.
- Mensajes en espanol para el backend, con formato `tipo(scope): descripcion`.
- Nunca agregar `Co-Authored-By` ni marcas de IA.
