# test\create_test_dirs.sh
#!/bin/bash

# Enhanced script with random file generation
EXTENSIONS=(".js" ".ts" ".jsx" ".tsx" ".java" ".c" ".cpp" ".cs" ".go" ".rs" ".php" ".swift" ".kt" ".m" ".scala" ".py" ".sh" ".rb" ".pl")

# Function to generate random filename with random extension
generate_random_file() {
    local dir="$1"
    local base_names=("controller" "service" "util" "helper" "handler" "model" "view" "component" "config" "test" "spec" "index" "main" "app" "server" "client" "api" "auth" "user" "admin" "data" "cache" "logger" "validator" "parser" "generator" "builder" "factory" "manager" "processor" "analyzer" "transformer" "converter" "mapper" "router" "middleware" "guard" "filter" "interceptor" "decorator" "adapter" "facade" "proxy" "singleton" "observer" "strategy" "template" "bridge" "composite" "flyweight")
    
    local random_base=${base_names[$RANDOM % ${#base_names[@]}]}
    local random_ext=${EXTENSIONS[$RANDOM % ${#EXTENSIONS[@]}]}
    local random_suffix=$((RANDOM % 1000))
    
    # Sometimes add a suffix, sometimes don't
    if [ $((RANDOM % 3)) -eq 0 ]; then
        touch "$dir/${random_base}${random_suffix}${random_ext}"
    else
        touch "$dir/${random_base}${random_ext}"
    fi
}

# Function to populate a directory with random files
populate_random_files() {
    local dir="$1"
    local min_files="${2:-1}"
    local max_files="${3:-8}"
    
    if [ -d "$dir" ]; then
        local num_files=$((RANDOM % (max_files - min_files + 1) + min_files))
        for ((i=0; i<num_files; i++)); do
            generate_random_file "$dir"
        done
    fi
}

# Function to recursively add random files to all directories
add_random_files_recursive() {
    local base_dir="$1"
    
    # Find all directories and add random files to each
    find "$base_dir" -type d | while read -r dir; do
        # Skip hidden directories sometimes
        if [[ "$(basename "$dir")" == .* ]] && [ $((RANDOM % 3)) -eq 0 ]; then
            continue
        fi
        
        # Vary the number of files based on directory depth
        local depth=$(echo "$dir" | tr -cd '/' | wc -c)
        local max_files=$((10 - depth))
        [ "$max_files" -lt 1 ] && max_files=1
        
        populate_random_files "$dir" 1 "$max_files"
    done
}

# Script 1: React/Next.js Project Structure
generate_nextjs_project() {
    local project_name="nextjs-test-project"
    
    echo "Generating Next.js project structure..."
    
    # Create main directories
    mkdir -p "$project_name"/{src,public,components,pages,styles,lib,utils,hooks}
    mkdir -p "$project_name"/.next/{cache,server,static}
    mkdir -p "$project_name"/node_modules/{react,next,"@types"}
    mkdir -p "$project_name"/components/{ui,forms,layout,shared,common}
    mkdir -p "$project_name"/pages/{api,auth,dashboard,profile}
    mkdir -p "$project_name"/public/{images,icons,assets,fonts}
    mkdir -p "$project_name"/src/{store,context,types,constants}
    
    # Create some structured files first
    touch "$project_name"/{package.json,package-lock.json,next.config.js,tsconfig.json}
    touch "$project_name"/{.env.local,.env.example,.gitignore}
    touch "$project_name"/README.md
    
    # Add random files to all directories
    add_random_files_recursive "$project_name"
    
    echo "✅ Next.js project structure created in '$project_name'"
}

# Script 2: Python Project Structure
generate_python_project() {
    local project_name="python-test-project"
    
    echo "Generating Python project structure..."
    
    # Create directories
    mkdir -p "$project_name"/{src,tests,docs,scripts,migrations}
    mkdir -p "$project_name"/src/{models,views,controllers,utils,services,middleware}
    mkdir -p "$project_name"/{.pytest_cache,__pycache__,.venv/lib/python3.9/site-packages}
    mkdir -p "$project_name"/dist
    mkdir -p "$project_name"/tests/{unit,integration,fixtures}
    mkdir -p "$project_name"/.coverage_data
    
    # Create some structured files
    touch "$project_name"/{README.md,requirements.txt,setup.py,pyproject.toml}
    touch "$project_name"/{.gitignore,.env,.env.example}
    touch "$project_name"/{Dockerfile,docker-compose.yml}
    
    # Add random files everywhere
    add_random_files_recursive "$project_name"
    
    echo "✅ Python project structure created in '$project_name'"
}

# Script 3: Node.js Project with Build Artifacts
generate_nodejs_project() {
    local project_name="nodejs-test-project"
    
    echo "Generating Node.js project with build artifacts..."
    
    # Create directories
    mkdir -p "$project_name"/{src,dist,build,public,config,temp}
    mkdir -p "$project_name"/{node_modules,coverage,.nyc_output}
    mkdir -p "$project_name"/src/{routes,middleware,services,models,controllers,validators}
    mkdir -p "$project_name"/dist/{js,css,assets,chunks}
    mkdir -p "$project_name"/build/{chunks,assets,static}
    mkdir -p "$project_name"/node_modules/.cache/{babel,webpack,terser,eslint}
    mkdir -p "$project_name"/public/{uploads,downloads,cache}
    
    # Create structured files
    touch "$project_name"/{package.json,package-lock.json,webpack.config.js}
    touch "$project_name"/{babel.config.js,jest.config.js,.eslintrc.js}
    touch "$project_name"/{.gitignore,.env,.env.production}
    
    # Add chaos with random files
    add_random_files_recursive "$project_name"
    
    echo "✅ Node.js project structure created in '$project_name'"
}

# Script 4: Complex Full-Stack Project 
generate_fullstack_project() {
    local project_name="fullstack-test-project"
    
    echo "Generating complex full-stack project..."
    
    # Create directories
    mkdir -p "$project_name"/{frontend,backend,shared,docs,scripts,docker,database}
    mkdir -p "$project_name"/frontend/{src,public,build,node_modules,cypress,jest}
    mkdir -p "$project_name"/backend/{src,dist,uploads,logs,node_modules,migrations,seeders}
    mkdir -p "$project_name"/shared/{types,utils,constants,validators,interfaces}
    mkdir -p "$project_name"/{.git,.github/workflows,deployment,monitoring}
    mkdir -p "$project_name"/database/{schemas,procedures,triggers,views}
    
    # Frontend structure
    mkdir -p "$project_name"/frontend/src/{components,pages,hooks,services,store,assets,styles}
    mkdir -p "$project_name"/frontend/{.next,coverage,storybook}
    
    # Backend structure  
    mkdir -p "$project_name"/backend/src/{controllers,services,models,middleware,jobs,queues}
    mkdir -p "$project_name"/backend/{migrations,seeders,tests,config}
    
    # Create some base files
    touch "$project_name"/{README.md,docker-compose.yml,Makefile}
    touch "$project_name"/{.gitignore,.env.example,lerna.json}
    
    # Generate random files in all directories
    add_random_files_recursive "$project_name"
    
    echo "✅ Full-stack project structure created in '$project_name'"
}

# Script 5: Chaos Project (maximum randomness)
generate_chaos_project() {
    local project_name="chaos-test-project"
    
    echo "Generating maximum chaos project..."
    
    # Create deeply nested and random directory structure
    mkdir -p "$project_name"/{level1,level2,level3}
    mkdir -p "$project_name"/level1/{a,b,c,d,e}
    mkdir -p "$project_name"/level1/a/{deep,deeper,deepest}
    mkdir -p "$project_name"/level1/b/{random,stuff,here}
    mkdir -p "$project_name"/level2/{x,y,z}/{1,2,3}
    mkdir -p "$project_name"/level3/{alpha,beta,gamma}/{test,prod,dev}
    
    # Create directories with special characters
    mkdir -p "$project_name"/{".hidden-chaos","folder with spaces","weird-chars-éñ"}
    mkdir -p "$project_name"/very/deep/nested/structure/that/goes/really/deep/for/testing
    
    # Create some scattered regular directories
    mkdir -p "$project_name"/{utils,helpers,services,models,views,controllers}
    mkdir -p "$project_name"/{assets,static,public,private,temp,cache}
    
    # Generate massive amounts of random files
    add_random_files_recursive "$project_name"
    
    # Add extra random files in root
    for i in {1..15}; do
        generate_random_file "$project_name"
    done
    
    echo "✅ Chaos project structure created in '$project_name'"
}

# Script 6: Mixed Extension Madness
generate_mixed_project() {
    local project_name="mixed-extensions-project"
    
    echo "Generating mixed extensions project..."
    
    # Create a flatter but wider structure
    mkdir -p "$project_name"/{dir1,dir2,dir3,dir4,dir5,dir6,dir7,dir8,dir9,dir10}
    mkdir -p "$project_name"/{backend,frontend,mobile,desktop,scripts,tools}
    mkdir -p "$project_name"/{java-stuff,cpp-stuff,go-stuff,rust-stuff,php-stuff}
    mkdir -p "$project_name"/{old-code,new-code,experimental,deprecated}
    
    # Add tons of random files with mixed extensions
    add_random_files_recursive "$project_name"
    
    # Create some directories that are more likely to have specific extensions
    mkdir -p "$project_name"/polyglot
    for ext in "${EXTENSIONS[@]}"; do
        for i in {1..3}; do
            touch "$project_name/polyglot/file$i$ext"
        done
    done
    
    echo "✅ Mixed extensions project structure created in '$project_name'"
}

# Main execution
echo "🚀 Generating test project structures with random files..."
echo "--------------------------------------------------------"

generate_nextjs_project
echo ""
generate_python_project  
echo ""
generate_nodejs_project
echo ""
generate_fullstack_project
echo ""
generate_chaos_project
echo ""
generate_mixed_project

echo ""
echo "🎉 All project structures with random files generated successfully!"
echo "You now have 6 different project structures to test your ASCII tree generator:"
echo "  1. nextjs-test-project - React/Next.js with random files"
echo "  2. python-test-project - Python project with mixed extensions" 
echo "  3. nodejs-test-project - Node.js with random file chaos"
echo "  4. fullstack-test-project - Complex monorepo with random files"
echo "  5. chaos-test-project - Maximum randomness and deep nesting"
echo "  6. mixed-extensions-project - Wide structure with all extensions"
echo ""
echo "Each directory now contains random files with extensions from your list!"
echo "File extensions used: ${EXTENSIONS[*]}"