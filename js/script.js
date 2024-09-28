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

    // Alterar a cor do texto do formulário para preto antes de capturar a imagem
    const form = document.getElementById('architecture-form');
    form.style.color = 'black'; // Define todo o texto do formulário como preto

    // Crie uma nova instância do PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Configurações da página
    const pageWidth = pdf.internal.pageSize.width; // Largura da página A4 em mm
    const margin = 10; // Margem em mm

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

    // Use html2canvas para capturar o conteúdo do formulário específico
    html2canvas(document.getElementById('architecture-form'), {
        scrollY: -window.scrollY, // Ajusta a rolagem
        useCORS: true // Permite capturar imagens de outros domínios
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Converta a imagem para o formato PNG
        const imgWidth = pageWidth - 2 * margin; // Largura da imagem, considerando as margens
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calcule a altura com base nas proporções

        let heightLeft = imgHeight; // Altura restante da imagem para adicionar outras páginas
        let position = 0; // Posição inicial da primeira página

        // Adicione a primeira parte da imagem ao PDF
        pdf.addImage(imgData, 'PNG', margin, 60, imgWidth, imgHeight); // Adiciona imagem com margem
        heightLeft -= pdf.internal.pageSize.height - 60; // Subtraia a altura da página menos a altura do título e margem

        // Adicione novas páginas se necessário
        while (heightLeft > 0) {
            pdf.addPage(); // Adicione uma nova página ao PDF
            position = heightLeft - imgHeight; // Atualize a posição
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Adicione a nova parte da imagem
            heightLeft -= pdf.internal.pageSize.height; // Continue subtraindo até cobrir toda a página
        }

        // Salve o PDF
        pdf.save('pagina-completa.pdf');
    });
});

// Lógica para exibir e fechar a janela de informação
document.getElementById('info-btn').addEventListener('click', () => {
    document.getElementById('info-content').style.display = 'block';
});

document.getElementById('info-close').addEventListener('click', () => {
    document.getElementById('info-content').style.display = 'none';
});
