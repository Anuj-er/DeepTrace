"""
DeepTrace PDF Report Generator — produces a professional forensic report.
"""

import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    HRFlowable,
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def generate_pdf_report(analysis: dict, output_dir: str) -> str:
    """Generate a PDF forensic report and return the file path."""

    aid = analysis["id"]
    pdf_path = os.path.join(output_dir, f"{aid}_report.pdf")

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
    )

    styles = getSampleStyleSheet()
    story = []

    # ── custom styles ────────────────────────────────────────────────
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontSize=22,
        spaceAfter=4,
        textColor=colors.HexColor("#1a1a2e"),
    )
    heading_style = ParagraphStyle(
        "SectionHead",
        parent=styles["Heading2"],
        fontSize=13,
        spaceBefore=18,
        spaceAfter=8,
        textColor=colors.HexColor("#1a1a2e"),
        borderPadding=(0, 0, 4, 0),
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#333333"),
    )
    small = ParagraphStyle(
        "Small",
        parent=body,
        fontSize=8,
        textColor=colors.HexColor("#888888"),
    )

    # ── header ───────────────────────────────────────────────────────
    story.append(Paragraph("DEEPTRACE", title_style))
    story.append(Paragraph("Forensic Analysis Report", ParagraphStyle(
        "Subtitle", parent=body, fontSize=12, textColor=colors.HexColor("#666666"),
    )))
    story.append(Spacer(1, 6))

    header_data = [
        ["Report ID", f"DT-{aid.upper()}"],
        ["Date", datetime.now().strftime("%B %d, %Y — %H:%M")],
        ["Classification", "CONFIDENTIAL"],
    ]
    ht = Table(header_data, colWidths=[3.5 * cm, 10 * cm])
    ht.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#888888")),
        ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#1a1a2e")),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(ht)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", color=colors.HexColor("#dddddd")))

    # ── 1. executive summary ─────────────────────────────────────────
    story.append(Paragraph("1 — Executive Summary", heading_style))

    verdict = analysis["verdict"]
    conf = analysis["confidence"]
    risk = analysis["risk_level"]
    v_color = "#dc2626" if verdict != "Authentic" else "#16a34a"

    story.append(Paragraph(
        f'The submitted image has been classified as '
        f'<font color="{v_color}"><b>{verdict.upper()}</b></font> '
        f'with <b>{conf}%</b> confidence.',
        body,
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f'<b>Risk Level:</b> <font color="{v_color}">{risk.upper()}</font>', body))
    story.append(Spacer(1, 6))

    # ── 2. image evidence ────────────────────────────────────────────
    story.append(Paragraph("2 — Visual Evidence", heading_style))

    img_dir = output_dir
    img_pairs = []
    for label, key in [("Original", "original"), ("Grad-CAM Heatmap", "heatmap")]:
        fpath = os.path.join(img_dir, f"{aid}_{key}.jpg")
        if os.path.exists(fpath):
            img_pairs.append((label, fpath))

    if img_pairs:
        imgs_row = []
        labels_row = []
        for label, fpath in img_pairs:
            imgs_row.append(Image(fpath, width=7 * cm, height=5.25 * cm))
            labels_row.append(Paragraph(f"<b>{label}</b>", ParagraphStyle("ImgLabel", parent=small, alignment=1)))

        t = Table([imgs_row, labels_row], colWidths=[7.5 * cm] * len(imgs_row))
        t.setStyle(TableStyle([
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 1), (-1, 1), 4),
        ]))
        story.append(t)

    # ── 3. detailed findings ─────────────────────────────────────────
    story.append(Paragraph("3 — Detailed Findings", heading_style))

    # face detection
    fd = analysis["face_detection"]
    story.append(Paragraph("<b>3.1 Face Detection (MTCNN)</b>", body))
    fd_data = [
        ["Faces Detected", str(fd["count"])],
        ["Detection Confidence", f'{fd["confidence"]}%'],
        ["Manipulation Probability", f'{fd["manipulation_score"]}%'],
    ]
    ft = Table(fd_data, colWidths=[5 * cm, 8 * cm])
    ft.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#666666")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8f8f8")),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(ft)
    story.append(Spacer(1, 8))

    # ELA
    ela = analysis["ela"]
    story.append(Paragraph("<b>3.2 Error Level Analysis</b>", body))
    story.append(Paragraph(
        f'Compression variance score: <b>{ela["variance_score"]}%</b>. {ela["description"]}.', body
    ))
    story.append(Spacer(1, 8))

    # metadata
    meta = analysis["metadata"]
    story.append(Paragraph("<b>3.3 Metadata Extraction</b>", body))
    meta_rows = [
        ["File Name", meta["file_name"]],
        ["File Size", meta["file_size"]],
        ["Dimensions", meta["dimensions"]],
        ["Format", meta["format"]],
        ["Software", meta["software"]],
        ["Camera Model", meta["camera_model"]],
        ["GPS Data", meta["gps_data"]],
        ["Created", meta["created_date"]],
    ]
    mt = Table(meta_rows, colWidths=[4 * cm, 9 * cm])
    mt.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#666666")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8f8f8")),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(mt)

    # ── 4. risk assessment ───────────────────────────────────────────
    story.append(Paragraph("4 — Risk Assessment", heading_style))
    scores = analysis["scores"]
    risk_rows = [
        ["Face Manipulation Score", f'{scores["face_manipulation"]}%'],
        ["Compression Anomaly Score", f'{scores["compression_anomaly"]}%'],
        ["Metadata Integrity", f'{scores["metadata_integrity"]}%'],
    ]
    rt = Table(risk_rows, colWidths=[6 * cm, 7 * cm])
    rt.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8f8f8")),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(rt)

    # ── 5. recommendations ───────────────────────────────────────────
    story.append(Paragraph("5 — Recommendations", heading_style))
    recs = [
        "Do not use this media as verified evidence without independent corroboration.",
        "Flag the source for potential disinformation distribution.",
        "Retain this report and original file hash for audit records.",
    ]
    for r in recs:
        story.append(Paragraph(f"• {r}", body))
    story.append(Spacer(1, 20))

    # ── footer ───────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", color=colors.HexColor("#dddddd")))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Generated by DeepTrace v1.0 · For informational purposes only.", small
    ))

    doc.build(story)
    return pdf_path
