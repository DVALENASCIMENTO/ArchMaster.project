document.getElementById('generate-pdf').addEventListener('click', () => { 
    // Acesse a função jsPDF corretamente
    const { jsPDF } = window.jspdf;

    // Use html2canvas para capturar o conteúdo do formulário específico
    html2canvas(document.getElementById('architecture-form'), {
        scrollY: -window.scrollY, // Ajusta a rolagem
        useCORS: true // Permite capturar imagens de outros domínios
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Converta a imagem para o formato PNG
        const pdf = new jsPDF('p', 'mm', 'a4'); // Inicialize o PDF no formato A4
        const pageWidth = pdf.internal.pageSize.width; // Largura da página A4 em mm
        const pageHeight = pdf.internal.pageSize.height; // Altura da página A4 em mm
        const margin = 10; // Margem em mm
        const imgWidth = pageWidth - 2 * margin; // Largura da imagem, considerando as margens
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calcule a altura com base nas proporções

        let heightLeft = imgHeight; // Altura restante da imagem para adicionar outras páginas
        let position = 0; // Posição inicial da primeira página

        // Adiciona um título na primeira página
        pdf.setFontSize(22);
        pdf.text('Arquitetura de Software', margin, 20);

        // Adicione a primeira parte da imagem ao PDF
        pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, imgHeight); // Adiciona imagem com margem
        heightLeft -= pageHeight - 30; // Subtraia a altura da página menos a altura do título e margem

        // Adicione novas páginas se necessário
        while (heightLeft > 0) {
            pdf.addPage(); // Adicione uma nova página ao PDF
            position = heightLeft - imgHeight; // Atualize a posição
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Adicione a nova parte da imagem
            heightLeft -= pageHeight; // Continue subtraindo até cobrir toda a página
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
