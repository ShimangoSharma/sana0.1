import { jsPDF } from 'jspdf';

export function buildSummaryText(sum) {
  const lines = [];
  lines.push('SANA — ' + sum.heading);
  lines.push('Prepared for ' + sum.doctor);
  lines.push(sum.rangeLabel);
  lines.push('');
  lines.push('PATIENT');
  lines.push(sum.patientLine);
  lines.push(sum.treatLine);
  lines.push('');
  lines.push(sum.entriesCount + ' entries · ' + sum.days + ' days · ' + sum.symptomsCount + ' symptoms tracked');
  lines.push('');
  if (sum.top.length) {
    lines.push('TOP SYMPTOMS');
    sum.top.forEach((t) => lines.push('- ' + t.name + ': ' + t.count + '× (' + t.trend + ')'));
    lines.push('');
  }
  lines.push('WORTH ASKING ABOUT');
  if (sum.askItems.length) sum.askItems.forEach((q) => lines.push('- ' + q));
  else lines.push('Nothing flagged in this period.');
  lines.push('');
  if (sum.entryList.length) {
    lines.push('ENTRY LOG');
    sum.entryList.forEach((e) => {
      lines.push('- ' + e.dateLabel + ' · ' + e.symptom + ' (' + e.sev + ', since ' + e.since + ')' + (e.hasPhoto ? ' [photo]' : ''));
      if (e.note) lines.push('    ' + e.note);
    });
  }
  return lines.join('\n');
}

export function buildSummaryPdf(sum) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = 56;

  const ensureRoom = (need) => {
    if (y + need > pageH - 48) {
      doc.addPage();
      y = 56;
    }
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(17, 116, 104);
  doc.text('SANA', marginX, y);
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('Symptom journal summary', marginX + 56, y - 1);
  y += 26;

  doc.setDrawColor(228, 220, 203);
  doc.line(marginX, y, pageW - marginX, y);
  y += 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(38, 50, 46);
  doc.text(sum.heading, marginX, y);
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(130, 130, 130);
  doc.text('Prepared for ' + sum.doctor + '  ·  ' + sum.rangeLabel, marginX, y);
  y += 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(150, 145, 130);
  doc.text('PATIENT', marginX, y);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(38, 50, 46);
  doc.text(sum.patientLine, marginX, y);
  y += 15;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 67, 61);
  doc.text(sum.treatLine, marginX, y);
  y += 28;

  const stats = [
    [String(sum.entriesCount), 'ENTRIES'],
    [String(sum.days), 'DAYS'],
    [String(sum.symptomsCount), 'SYMPTOMS'],
  ];
  const colW = (pageW - marginX * 2) / 3;
  stats.forEach((s, i) => {
    const x = marginX + i * colW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(38, 50, 46);
    doc.text(s[0], x, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(150, 145, 130);
    doc.text(s[1], x, y + 12);
  });
  y += 34;

  doc.setDrawColor(228, 220, 203);
  doc.line(marginX, y, pageW - marginX, y);
  y += 24;

  if (sum.top.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(150, 145, 130);
    doc.text('TOP SYMPTOMS', marginX, y);
    y += 16;
    sum.top.forEach((t) => {
      ensureRoom(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(38, 50, 46);
      doc.text(t.name + '  ' + t.count + '×', marginX, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(130, 120, 90);
      doc.text(t.trend, marginX + 220, y);
      y += 16;
    });
    y += 10;
  }

  doc.setDrawColor(228, 220, 203);
  doc.line(marginX, y, pageW - marginX, y);
  y += 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 116, 104);
  doc.text('WORTH ASKING ABOUT', marginX, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(55, 67, 61);
  const askLines = sum.askItems.length ? sum.askItems : ['Nothing flagged in this period.'];
  askLines.forEach((q) => {
    const wrapped = doc.splitTextToSize('•  ' + q, pageW - marginX * 2);
    wrapped.forEach((line) => {
      ensureRoom(15);
      doc.text(line, marginX, y);
      y += 14;
    });
  });
  y += 12;

  if (sum.entryList.length) {
    ensureRoom(30);
    doc.setDrawColor(228, 220, 203);
    doc.line(marginX, y, pageW - marginX, y);
    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(150, 145, 130);
    doc.text('ENTRY LOG', marginX, y);
    y += 16;
    sum.entryList.forEach((e) => {
      ensureRoom(28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(38, 50, 46);
      doc.text(e.dateLabel + '  ·  ' + e.symptom + '  ·  ' + e.sev + (e.hasPhoto ? '  ·  [photo]' : ''), marginX, y);
      y += 13;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(110, 110, 100);
      doc.text('Since ' + e.since, marginX, y);
      y += 13;
      if (e.note) {
        const noteLines = doc.splitTextToSize(e.note, pageW - marginX * 2);
        noteLines.forEach((line) => {
          ensureRoom(13);
          doc.setTextColor(70, 80, 75);
          doc.text(line, marginX, y);
          y += 12;
        });
      }
      y += 8;
    });
  }

  return doc;
}

export async function shareSummary(sum, pdfDoc) {
  const text = buildSummaryText(sum);
  const filename = 'SANA-summary-' + Date.now() + '.pdf';

  if (navigator.share) {
    try {
      if (pdfDoc && navigator.canShare) {
        const blob = pdfDoc.output('blob');
        const file = new File([blob], filename, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'SANA summary', text: sum.heading, files: [file] });
          return 'shared';
        }
      }
      await navigator.share({ title: 'SANA summary', text });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled';
      // fall through to clipboard
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return 'copied';
  }
  return 'unsupported';
}
