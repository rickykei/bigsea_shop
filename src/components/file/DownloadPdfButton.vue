<script>
export default function useDownloadPdf() {
  function downloadPdf(pdfUrl) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = 'my-pdf-file.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    downloadPdf,
  };
}
</script>
