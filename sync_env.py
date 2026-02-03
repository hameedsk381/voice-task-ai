import shutil
import os

def sync_env():
    root_env = ".env"
    targets = [
        "backend/.env",
        "frontend/.env.local"
    ]

    if not os.path.exists(root_env):
        print(f"❌ Root {root_env} not found!")
        return

    for target in targets:
        target_dir = os.path.dirname(target)
        if os.path.exists(target_dir):
            shutil.copy(root_env, target)
            print(f"✅ Synced to {target}")
        else:
            print(f"⚠️ Skipping {target} (directory not found)")

if __name__ == "__main__":
    sync_env()
