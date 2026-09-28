import json
import os
import re

with open('/home/emanncode/linear_project.json', 'r') as f:
    data = json.load(f)

documents = data['data']['project']['documents']['nodes']
skills_dir = '.agents/skills'

def slugify(value):
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[\s_-]+', '-', value)

for doc in documents:
    title = doc['title']
    content = doc['content']
    slug = slugify(title)
    
    # special mappings for existing folders to prevent duplicates
    if 'design-system' in slug: slug = 'soldbay-design-system'
    elif 'featureworkflow-inventory' in slug or 'feature-workflow-inventory' in slug: slug = 'soldbay-feature-inventory'
    elif 'component-inventory' in slug: slug = 'soldbay-component-inventory'
    elif 'screen-flow' in slug and 'admin' not in slug: slug = 'soldbay-screen-flow'
    elif 'mvp-scope' in slug: slug = 'soldbay-vision'
    elif 'workflow-continuation' in slug: slug = 'soldbay-workflow'
    elif 'screen-design-prompts' in slug: slug = 'soldbay-screen-prompts'
    elif 'project-overview' in slug: slug = 'allonsoldbay'
    elif not slug.startswith('soldbay-') and slug != 'allonsoldbay':
        slug = f"soldbay-{slug}"

    skill_path = os.path.join(skills_dir, slug)
    os.makedirs(skill_path, exist_ok=True)
    
    md_path = os.path.join(skill_path, 'SKILL.md')
    
    frontmatter = f"---\nname: {slug}\ndescription: Information about {title} for Soldbay\n---\n\n# {title}\n\n"
    
    with open(md_path, 'w') as f:
        f.write(frontmatter + content)
        
print("Skills updated!")
