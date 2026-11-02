import subprocess
import os

scenes = [
    {
        "id": "scene1",
        "title": "LlamaModernize: Enterprise Copilot",
        "subtitle": "Powered by Meta Llama 3 (128k Context Window)",
        "narration": "Welcome to LlamaModernize, an agentic enterprise legacy modernization copilot powered by Meta Llama 3.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "Targets Monolithic .NET / C# Codebases | Saves Months of Manual Refactoring"
    },
    {
        "id": "scene2",
        "title": "The Legacy Monolith Crisis",
        "subtitle": "Contoso Billing - 1,280 LOC God Controller (.NET 4.8)",
        "narration": "Enterprise teams face massive technical debt in legacy monolithic codebases. Contoso Billing features an unmanageable God class with raw ADO.NET, manual SQL transactions, and tight SMTP coupling.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "340 Hours Debt - Coupling Index 94 Percent - Zero Unit Tests"
    },
    {
        "id": "scene3",
        "title": "Phase 1: Architecture Assessment",
        "subtitle": "AST Blast Radius & Strangler Fig Roadmap",
        "narration": "In Phase One, Meta Llama 3 performs deep abstract syntax tree parsing. It detects all architectural anti-patterns, quenches the blast radius, and defines a four-phase Strangler Fig migration roadmap.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Coupling Slashed from 94 to 12 Percent - Maintainability +57 Points"
    },
    {
        "id": "scene4",
        "title": "Phase 2: Dependency Uncoupling",
        "subtitle": "Inverting Concrete Dependencies into Segregated Contracts",
        "narration": "In Phase Two, LlamaModernize decouples all concrete dependencies. It extracts clean repository and payment interfaces, generating an automated Microsoft Extensions Dependency Injection configuration.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Extracted IOrderRepository and IPaymentGateway - Scoped DI"
    },
    {
        "id": "scene5",
        "title": "Phase 3: SOLID Refactoring",
        "subtitle": "CQRS MediatR Handlers & Rich Domain Aggregates",
        "narration": "In Phase Three, Meta Llama 3 applies all five SOLID principles. It refactors the monolith into modern .NET 9 Clean Architecture, shrinking the controller to a clean fifteen-line endpoint.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "15-Line Ultra-Thin Controller - MediatR CQRS Handlers - Rich Domain"
    },
    {
        "id": "scene6",
        "title": "Phase 4: Schema Migration",
        "subtitle": "ADO.NET to EF Core 9 with Concurrency Tokens",
        "narration": "In Phase Four, the copilot replaces fragile SQL queries with typed EF Core 9 configurations. It adds RowVersion optimistic locking tokens and generates idempotent SQL Server migration scripts.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Zero SQL Injection - RowVersion Optimistic Locking - DDL Migrations"
    },
    {
        "id": "scene7",
        "title": "Phase 5: Automated Regression Safety",
        "subtitle": "xUnit + Moq Test Suite (100 Percent Assertion Pass)",
        "narration": "Finally, in Phase Five, LlamaModernize generates a complete xUnit and Moq regression test suite. Every domain rule and failure mode is validated, confirming full regression safety and 97 percent code coverage.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "100 Percent Assertion Pass - 97.4 Percent Coverage - Zero Regressions"
    },
    {
        "id": "scene8",
        "title": "Enterprise Solution Ready",
        "subtitle": "Export Complete .NET 9 Clean Architecture Package",
        "narration": "LlamaModernize cuts down months of manual refactoring to minutes. Enterprise modernization powered by Meta Llama 3 is now complete, verified, and ready for deployment.",
        "bg_image": "/app/applet/src/assets/images/avatar_lead_architect_1793431217362.jpg",
        "highlights": "Clean Architecture Solution (.sln) | Full Production Artifacts | Built with Meta Llama 3"
    }
]

build_dir = "/tmp/video_final"
os.makedirs(build_dir, exist_ok=True)
os.makedirs("/app/applet/public/videos", exist_ok=True)

font_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_reg = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

clip_paths = []

for i, scene in enumerate(scenes):
    sid = scene["id"]
    wav_path = os.path.join(build_dir, f"{sid}.wav")
    mp4_path = os.path.join(build_dir, f"{sid}.mp4")

    # Generate TTS Audio
    subprocess.run([
        "espeak-ng",
        "-v", "en-us",
        "-s", "145",
        "-p", "48",
        "-a", "180",
        "-w", wav_path,
        scene["narration"]
    ], check=True)

    dur = float(subprocess.check_output(f"ffprobe -i {wav_path} -show_entries format=duration -v quiet -of csv='p=0'", shell=True).decode().strip()) + 0.6

    t_clean = scene["title"].replace("'", "")
    st_clean = scene["subtitle"].replace("'", "")
    hl_clean = scene["highlights"].replace("'", "")
    narr_short = scene["narration"][:82].replace("'", "") + "..."

    filter_complex = (
        f"[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        f"drawbox=x=0:y=0:w=1280:h=720:color=black@0.65:t=fill,"
        f"drawbox=x=40:y=40:w=1200:h=640:color=cyan@0.4:t=2,"
        f"drawtext=fontfile={font_bold}:text='LLAMAMODERNIZE ENTERPRISE COPILOT':x=70:y=70:fontsize=18:fontcolor=0x06b6d4,"
        f"drawtext=fontfile={font_bold}:text='{t_clean}':x=70:y=120:fontsize=34:fontcolor=white,"
        f"drawtext=fontfile={font_reg}:text='{st_clean}':x=70:y=180:fontsize=20:fontcolor=0x94a3b8,"
        f"drawbox=x=70:y=240:w=1140:h=80:color=0x0f172a@0.9:t=fill,"
        f"drawtext=fontfile={font_bold}:text='KEY HIGHLIGHTS:':x=90:y=260:fontsize=14:fontcolor=0x38bdf8,"
        f"drawtext=fontfile={font_reg}:text='{hl_clean}':x=90:y=288:fontsize=15:fontcolor=0x34d399,"
        f"drawbox=x=70:y=560:w=1140:h=90:color=black@0.85:t=fill,"
        f"drawtext=fontfile={font_bold}:text='ENGLISH NARRATION:':x=90:y=580:fontsize=14:fontcolor=0xf43f5e,"
        f"drawtext=fontfile={font_reg}:text='\"{narr_short}\"':x=90:y=610:fontsize=16:fontcolor=white[v]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", scene["bg_image"],
        "-i", wav_path,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(dur),
        mp4_path
    ]
    subprocess.run(cmd, check=True)
    clip_paths.append(mp4_path)
    print(f"[{i+1}/8] Rendered {sid} ({dur:.1f}s)")

# Concat
concat_txt = os.path.join(build_dir, "concat.txt")
with open(concat_txt, "w") as f:
    for cp in clip_paths:
        f.write(f"file '{cp}'\n")

final_output = "/app/applet/public/videos/llama_modernize_demo_walkthrough.mp4"
subprocess.run([
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", concat_txt,
    "-c", "copy",
    final_output
], check=True)

print(f"COMPLETE: Video generated successfully at {final_output}")
