 // link da planilha gerado usando o script
const URL_BASE_PLANILHA = "https://script.google.com/macros/s/AKfycbwb-iA0eOUHlW62yuLPbFXQ4OXLSYgoq_1E6WrQKs-rB4xcFhtkdxNUKFNalTxs8iyn/exec";

// Lista de estilos de desenho para o ícone não ficar sem imagem na tela
const ESTILOS_ICONE = ['avataaars', 'micah', 'bottts', 'lorelei', 'notionists'];

/**
 * Função assíncrona que busca apenas os perfis da aba 'perfil'.
 */
export async function buscarPerfisDaPlanilha() {
  const urlPerfil = `${URL_BASE_PLANILHA}?aba=perfil`;

  try {
    console.log("1. A conectar à planilha Google via JavaScript...");

    const resposta = await fetch(urlPerfil);


    if (!resposta.ok) {
      throw new Error(`Erro ao aceder à planilha. Código: ${resposta.status}`);
    }

    const listaDaPlanilha = await resposta.json();
    console.log("2. Dados brutos recebidos da aba 'perfil':", listaDaPlanilha);


    const perfisSimplificados = listaDaPlanilha.map((linha, indice) => {
      const nomeDaPessoa = linha["Nome"];

      const estilo = ESTILOS_ICONE[indice % ESTILOS_ICONE.length];
      const iconeUrl = `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(nomeDaPessoa)}`;

      return {
        id: indice + 1,
        name: nomeDaPessoa,
        avatar: iconeUrl
      };
    });

    return perfisSimplificados;

  } catch (erro) {
    console.error("Ocorreu um erro ao buscar o JSON da planilha:", erro);
    return []; 
  }
}