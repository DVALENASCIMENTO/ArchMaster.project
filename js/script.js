// script.js

// Função para ajustar a altura do textarea automaticamente
const textareas = document.querySelectorAll('textarea');

textareas.forEach(textarea => {
    textarea.addEventListener('input', autoResize);
    autoResize.call(textarea); // Chama a função inicialmente para ajustar
});

function autoResize() {
    this.style.height = 'auto'; // Reseta a altura
    this.style.height = this.scrollHeight + 'px'; // Define a nova altura
} 

document.getElementById('generate-pdf').addEventListener('click', () => {
    // Acesse a função jsPDF corretamente
    const { jsPDF } = window.jspdf;

    // Altere a cor do texto para preto e desative o ajuste automático de altura antes de capturar
    const form = document.getElementById('architecture-form');
    const textareas = form.querySelectorAll('textarea');
    const inputs = form.querySelectorAll('input[type="text"]');

    form.style.color = 'black'; // Garante que o texto esteja em preto
    textareas.forEach(textarea => {
        textarea.style.height = textarea.scrollHeight + 'px'; // Define altura fixa
    });
    inputs.forEach(input => {
        input.style.height = 'auto'; // Opcional: Ajusta altura de inputs, se necessário
    });

    // Crie uma nova instância do PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Configurações da página
    const pageWidth = pdf.internal.pageSize.getWidth(); // Largura da página A4 em mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // Altura da página A4 em mm
    const margin = 10; // Margem em mm
    const maxWidth = pageWidth - 2 * margin; // Largura máxima do texto
    const lineHeight = 7; // Altura da linha em mm

    // Título da página
    const title = 'ArchMaster';
    pdf.setFontSize(22);
    pdf.setTextColor(0, 0, 0); // Define o texto na cor preta
    const titleWidth = pdf.getTextWidth(title); // Largura do título
    const titleX = (pageWidth - titleWidth) / 2; // Calcula a posição para centralizar o título
    pdf.text(title, titleX, 20); // Posição do título centralizado

    // Subtítulo da página
    const subtitle = '"Software Architecture Document Generator"';
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0); // Define a cor do subtítulo como preto
    const subtitleWidth = pdf.getTextWidth(subtitle); // Largura do subtítulo
    const subtitleX = (pageWidth - subtitleWidth) / 2; // Calcula a posição para centralizar o subtítulo
    pdf.text(subtitle, subtitleX, 30); // Posição do subtítulo centralizado

    // Função para adicionar conteúdo de campos ao PDF com suporte a múltiplas linhas
    function addTextToPDF(label, text, yPosition) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Define o texto na cor preta

        // Adiciona o rótulo
        pdf.text(label, margin, yPosition);
        yPosition += lineHeight;

        // Divide o texto em múltiplas linhas
        const splitText = pdf.splitTextToSize(text, maxWidth);
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * lineHeight + 5; // Espaçamento adicional após cada resposta

        // Verifica se a próxima seção cabe na página atual, caso contrário, adiciona uma nova página
        if (yPosition > pageHeight - margin - 20) { // Ajuste conforme necessário
            pdf.addPage();
            yPosition = margin;
        }

        return yPosition; // Retorna a nova posição Y
    }

    // Posições iniciais
    let yPosition = 40; // Inicia abaixo do subtítulo

    // Array de perguntas e respostas mapeando labels e IDs conforme o HTML
    const questions = [
        { label: "Nome do Projeto:", id: "project-name" },
        { label: "Descrição Geral:", id: "project-description" },
        { label: "Stakeholders:", id: "stakeholders" },
        { label: "Escopo:", id: "scope" },
        { label: "Requisitos Funcionais:", id: "functional-requirements" },
        { label: "Requisitos Não Funcionais:", id: "non-functional-requirements" },
        { label: "Diagrama de Componentes:", id: "components-diagram" },
        { label: "Visão de Camadas:", id: "layer-vision" },
        { label: "Principais Tecnologias Utilizadas:", id: "technologies" },
        { label: "Front-end:", id: "frontend" },
        { label: "Back-end:", id: "backend" },
        { label: "Banco de Dados:", id: "database" },
        { label: "Integração e APIs:", id: "apis" },
        { label: "Fluxo Principal:", id: "sequence-diagram" },
        { label: "Estrutura do Projeto:", id: "project-structure" },
        { label: "Padrões de Codificação:", id: "coding-standards" },
        { label: "Controle de Versão:", id: "version-control" },
        { label: "CI/CD:", id: "ci-cd" },
        { label: "Autenticação e Autorização:", id: "authentication" },
        { label: "Proteção de Dados:", id: "data-protection" },
        { label: "Escalabilidade Horizontal/Vertical:", id: "scalability" },
        { label: "Caching:", id: "caching" },
        { label: "Monitoramento:", id: "monitoring" },
        { label: "Recuperação de Desastres:", id: "disaster-recovery" },
        { label: "Backups:", id: "backups" },
        { label: "Próximos Passos:", id: "next-steps" },
        { label: "Conclusão:", id: "conclusion" }
    ];

    // Adicionar cada pergunta e resposta ao PDF
    questions.forEach(q => {
        const element = document.getElementById(q.id);
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value.trim();
        } else if (element.tagName.toLowerCase() === 'input') {
            text = element.value.trim();
        }
        yPosition = addTextToPDF(q.label, text, yPosition);
    });

    // Adicionar rodapé a todas as páginas
    function addFooter() {
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Página ${i}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
    }

    addFooter();

    // Salve o PDF
    pdf.save('ArchMaster.pdf');
});

// Lógica para exibir e fechar a janela de informação
document.getElementById('info-btn').addEventListener('click', () => {
    document.getElementById('info-content').style.display = 'block';
});

document.getElementById('info-close').addEventListener('click', () => {
    document.getElementById('info-content').style.display = 'none';
});
