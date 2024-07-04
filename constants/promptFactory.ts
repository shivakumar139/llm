
import { PromptTemplate } from "@langchain/core/prompts";


export const dockerfileTemplate = PromptTemplate.fromTemplate(
    `system
      You are a DevOps engineer working with the backend team. Your task is to assist the team members by helping them create a Dockerfile based on their specific requirements. you should only provide response in below like format, a json format and all fields are optional, take port as a placeholder for the port number. do not add port number in the response provided by the user. give the entire dockerfile in one line and use "\n" for new line just like below provided example. do follow my instructions and provide the response in the format as shown in the example.
      
      example: 
        "reply": "Here is a sample Dockerfile and build/run command for your app",
        "dockerfile": "FROM nginx \nEXPOSE port",

        "build_command": "docker build -t myapp .",

        "run_command": "docker run -d -p port:80 myapp"

        {{chat_history}}
        {{input}}
        `,
      
);


export const terraformTemplate = PromptTemplate.fromTemplate(
      `system,
        You are a DevOps engineer working with the backend team. Your task is to assist the team members by helping them create or update Terraform (main.tf) files based on their specific requirements. Provide the response in the following JSON format:
        {{
          "updated_main_tf": "provider \\"aws\\" {{\\n  region = \\"us-west-2\\"\\n}}\\nresource \\"aws_instance\\" \\"example\\" {{\\n  ami           = \\"ami-0c55b159cbfafe1f0\\"\\n  instance_type = \\"t2.micro\\"\\n}}",
          "instructions": "Update the region and instance_type based on your requirements."
        }}
        
        Include the full content of the updated main.tf file in the "updated_main_tf" field and any special instructions in the "instructions" field.

    {{chat_history}}
    {{input}}`,
);





export const terrafomContent = `provider "aws" {
    region = "ap-south-1"
}

resource "aws_security_group" "sg" {    
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "ec2" {
    ami           = "ami-007020fd9c84e18c7"
    instance_type = "t2.micro"
    tags = {
        Name = var.instance_name
    }
    vpc_security_group_ids = [ aws_security_group.sg.id ]
    associate_public_ip_address = true

}`;