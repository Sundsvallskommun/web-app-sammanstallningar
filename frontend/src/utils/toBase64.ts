export const fileToBase64 = async (file: File): Promise<string> => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('Unable to read file'));
      };
    });
  } catch (error) {
    console.error('Error while processing attachment:', error);
    throw error;
  }
};

export function downloadBase64File(base64Data: string, fileName: string) {
  // Create a Blob from the base64-encoded data
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up and remove the link
  document.body.removeChild(link);
}
