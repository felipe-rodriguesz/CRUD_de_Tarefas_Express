import fs from 'node:fs/promises';

export const db = {
    tarefas: [],
    proxId: 1
};

try {
    const dadosFisicos = await fs.readFile('db.json', 'utf8');
    const dadosParseados = JSON.parse(dadosFisicos);

    db.tarefas = dadosParseados.tarefas;
    db.proxId = dadosParseados.proxId;
} catch (error) {
    
}

export async function salvarBanco() {
    const textoJSON = JSON.stringify(db);
    await fs.writeFile('db.json', textoJSON)
}