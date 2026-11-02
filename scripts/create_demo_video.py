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
        "subtitle": "Contoso Billing: 1,280 LOC God Controller (.NET Framework 4.8)",
        "narration": "Enterprise teams face massive technical debt in legacy monolithic codebases. Contoso Billing features an unmanageable God class with raw ADO.NET, manual SQL transactions, and tight SMTP coupling.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "340 Hours Technical Debt | Coupling Index: 94% | Zero Unit Tests | Thread Starvation"
    },
    {
        "id": "scene3",
        "title": "Phase 1: Architecture Assessment",
        "subtitle": "AST-Grounded Blast Radius & Strangler Fig Roadmap",
        "narration": "In Phase One, Meta Llama 3 performs deep abstract syntax tree parsing. It detects all architectural anti-patterns, quenches the blast radius, and defines a four-phase Strangler Fig migration roadmap.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Coupling Slashed from 94% to 12% | Maintainability Gained +57 Points | 4-Phase Roadmap"
    },
    {
        "id": "scene4",
        "title": "Phase 2: Dependency Uncoupling & IoC",
        "subtitle": "Inverting Concrete Dependencies into Segregated Contracts",
        "narration": "In Phase Two, LlamaModernize decouples all concrete dependencies. It extracts clean repository and payment interfaces, generating an automated Microsoft Extensions Dependency Injection configuration.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Extracted IOrderRepository & IPaymentGateway | Polly Circuit Breakers | Scoped DI"
    },
    {
        "id": "scene5",
        "title": "Phase 3: SOLID Refactoring to .NET 9",
        "subtitle": "CQRS MediatR Handlers & Rich Domain Aggregates",
        "narration": "In Phase Three, Meta Llama 3 applies all five SOLID principles. It refactors the monolith into modern .NET 9 Clean Architecture, shrinking the controller to a clean fifteen-line endpoint.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "15-Line Ultra-Thin API Controller | MediatR CQRS Command Handlers | Rich Domain Invariants"
    },
    {
        "id": "scene6",
        "title": "Phase 4: Schema Migration",
        "subtitle": "ADO.NET to EF Core 9 Fluent API with Concurrency Tokens",
        "narration": "In Phase Four, the copilot replaces fragile SQL queries with typed EF Core 9 configurations. It adds RowVersion optimistic locking tokens and generates idempotent SQL Server migration scripts.",
        "bg_image": "/app/applet/src/assets/images/arch_modernization_schematic_1793431219135.jpg",
        "highlights": "Zero SQL Injection | RowVersion Concurrency Protection | Idempotent DDL Migrations"
    },
    {
        "id": "scene7",
        "title": "Phase 5: Automated Regression Safety",
        "subtitle": "xUnit + Moq Test Suite (100% Assertion Pass)",
        "narration": "Finally, in Phase Five, LlamaModernize generates a complete xUnit and Moq regression test suite. Every domain rule and failure mode is validated, confirming full regression safety and 97 percent code coverage.",
        "bg_image": "/app/applet/src/assets/images/demo_video_poster_1793433139796.jpg",
        "highlights": "100% Assertion Pass Guaranteed | 97.4% Code Coverage | Zero Behavioral Drift"
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

tmp_dir = "/tmp/video_build"
os.makedirs(tmp_dir, exist_ok=True)
os.makedirs("/app/applet/public/videos", exist_ok=True)

font_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_reg = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

clip_files = []

for i, scene in enumerate(scenes):
    sid = scene["id"]
    audio_path = os.path.join(tmp_dir, f"{sid}.wav")
    clip_path = os.path.join(tmp_dir, f"{sid}_clean.mp4")

    # Generate audio
    cmd_audio = [
        "espeak-ng",
        "-v", "en-us",
        "-s", "140",
        "-p", "48",
        "-a", "180",
        "-w", audio_path,
        scene["narration"]
    ]
    subprocess.run(cmd_audio, check=True)

    # Get duration
    probe_cmd = f"ffprobe -i {audio_path} -show_entries format=duration -v quiet -of csv='p=0'"
    dur = float(subprocess.check_output(probe_cmd, shell=True).decode().strip()) + 0.8

    # Safe text lines
    t_clean = scene["title"].replace("'", "")
    st_clean = scene["subtitle"].replace("'", "")
    hl_clean = scene["highlights"].replace("'", "").replace("%", "%%")
    narr_short = scene["narration"][:80].replace("'", "") + "..."

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

    cmd_video = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", scene["bg_image"],
        "-i", audio_path,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(dur),
        clip_path
    ]
    subprocess.run(cmd_video, check=True)
    clip_files.append(clip_path)
    print(f"Rendered {sid} successfully ({dur:.1f}s)")

concat_list = os.path.join(tmp_dir, "concat_clean.txt")
with open(concat_list, "w") as f:
    for c in clip_files:
        f.write(f"file '{c}'\n")

final_mp4 = "/app/applet/public/videos/llama_modernize_demo_walkthrough.mp4"
concat_cmd = [
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", concat_list,
    "-c", "copy",
    final_mp4
]
subprocess.run(concat_cmd, check=True)
print(f"SUCCESS: Generated {final_mp4}")
