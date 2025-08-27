export async function getPartidos() {
    const response = await fetch('http://16.170.214.129:8080/partidos');
    return response.json();
}
