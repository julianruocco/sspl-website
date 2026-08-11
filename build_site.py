#!/usr/bin/env python3
"""
Penn State Student Space Programs Laboratory (SSPL)
Python Website Build & Embed Generator Script
"""

import json
import os

BOARD_FILE = "board_data.json"
OUTPUT_EMBED_BOARD = "embed_exec_board.html"

def generate_embeddable_board():
    if not os.path.exists(BOARD_FILE):
        print(f"Error: {BOARD_FILE} not found.")
        return

    with open(BOARD_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    members = data.get("executive_board", [])
    print(f"Loaded {len(members)} executive board slots.")

    embed_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSPL Executive Board - Google Sites Embed Widget</title>
    <style>
        :root {
            --bg-dark: #05070f;
            --bg-card: rgba(13, 19, 43, 0.9);
            --primary-cyan: #00f0ff;
            --border-color: rgba(0, 240, 255, 0.3);
            --text-main: #f0f4f8;
            --text-muted: #a0aec0;
        }
        body {
            background: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 15px;
        }
        .exec-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 15px;
        }
        .exec-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 240, 255, 0.1);
        }
        .exec-photo {
            width: 90px; height: 90px;
            margin: 0 auto 10px auto;
            border-radius: 50%;
            border: 2px solid var(--primary-cyan);
            background: #0d132b;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: var(--primary-cyan);
            font-weight: bold;
            font-size: 0.8rem;
        }
        .exec-name { font-size: 1.05rem; font-weight: bold; color: #ffffff; margin-bottom: 4px; }
        .exec-title { color: var(--primary-cyan); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
        .exec-bio { font-size: 0.8rem; color: var(--text-muted); line-height: 1.3; }
    </style>
</head>
<body>
    <div class="exec-grid">
"""

    for m in members:
        label = m.get("placeholder_label", "Slot")
        img_src = m.get("image", "")
        img_html = f'<img src="{img_src}" style="width:100%;height:100%;object-fit:cover;" />' if img_src else label
        
        embed_html += f"""        <div class="exec-card">
            <div class="exec-photo">
                {img_html}
            </div>
            <div class="exec-name">{m['name']}</div>
            <div class="exec-title">{m['title']}</div>
            <div class="exec-bio">{m['bio']}</div>
        </div>
"""

    embed_html += """    </div>
</body>
</html>"""

    with open(OUTPUT_EMBED_BOARD, "w", encoding="utf-8") as f:
        f.write(embed_html)

    print(f"Successfully generated standalone embed widget: {OUTPUT_EMBED_BOARD}")

if __name__ == "__main__":
    generate_embeddable_board()
