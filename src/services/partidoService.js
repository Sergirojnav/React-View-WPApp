export async function getPartidos() {
    const response = await fetch('http://192.168.1.54:8080/partidos');
    return response.json();
}
