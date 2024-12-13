export async function getPartidos() {
    const response = await fetch('http://localhost:8080/partidos');
    return response.json();
}
