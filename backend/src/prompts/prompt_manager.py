from typing import Dict, Any, Optional

import os
import yaml


class PromptManager:
    def __init__(self):
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.prompts: Dict[tuple, Dict[str, Any]] = {}

    def load_prompt(
        self,
        category: str,
        prompt_name: str,
        version: Optional[str] = None
    ) -> Dict[str, Any]:

        prompt_dir = os.path.join(self.base_path, category)

        if version:
            file_path = os.path.join(prompt_dir, f"{prompt_name}_v{version}.yaml")
        else:
            # find latest version
            yaml_files = [f for f in os.listdir(prompt_dir) if f.startswith(f"{prompt_name}_v") and f.endswith(".yaml")]
            if not yaml_files:
                raise FileNotFoundError(f"No prompt file found for {category}/{prompt_name}")
            yaml_files.sort(reverse=True)
            file_path = os.path.join(prompt_dir, yaml_files[0])

        if (category, prompt_name, version) not in self.prompts:
            with open(file_path, 'r', encoding='utf-8') as file:
                prompt_data = yaml.safe_load(file)
            self.prompts[(category, prompt_name, version)] = prompt_data

        return self.prompts[(category, prompt_name, version)]

    def get_prompt_contents(
        self,
        category: str,
        prompt_name: str,
        version: Optional[str] = None
    ) -> dict:

        prompt_data = self.load_prompt(category, prompt_name, version)
        prompt_contents = {}

        for prompt in prompt_data["prompts"]:
            prompt_contents[prompt["name"]] = prompt["content"]

        return prompt_contents
